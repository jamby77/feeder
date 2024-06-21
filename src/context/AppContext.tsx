"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { db } from "@/lib/db";
import { AppConfig, Category, Feed, FeedItem } from "@/types";

type AppContextValueType = {
  selectedItem: FeedItem | undefined;
  setSelectedItem: (item: FeedItem | undefined) => void;
  feed: Feed | undefined;
  setFeed: (feed: Feed | undefined) => void;
  feeds: Feed[] | undefined;
  config: AppConfig | undefined;
  categories: Category[] | undefined;
  feedItems: FeedItem[] | undefined;
  countAll: number | undefined;
  nextItem: () => void;
  prevItem: () => void;
  refreshFeeds: () => void;
};
const defaultValue: AppContextValueType = {
  selectedItem: undefined,
  setSelectedItem: (item: FeedItem | undefined) => {},
  feed: undefined,
  setFeed: (feed: Feed | undefined) => {},
  feeds: undefined,
  config: undefined,
  categories: undefined,
  feedItems: undefined,
  countAll: undefined,
  nextItem: () => {},
  prevItem: () => {},
  refreshFeeds: () => {},
};

const AppContext = createContext<AppContextValueType>(defaultValue);
async function fetchFeeds(feeds: Feed[], refreshInterval: number = 10) {
  if (!feeds) {
    console.warn("no feeds found");
    return;
  }
  const feedUrls = new URLSearchParams();
  const now = new Date();
  for (const feed of feeds) {
    const lastUpdated = feed.lastUpdated;
    if (lastUpdated && now.getTime() - lastUpdated.getTime() < refreshInterval) {
      // skip fetching
      continue;
    }
    feedUrls.append("urls[]", feed.xmlUrl);
    feedUrls.append("url", feed.xmlUrl);
  }
  const response = await fetch(`/api/feed?${feedUrls.toString()}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch feeds: ${response.status}`);
  }
  const json = (await response.json()) as {
    url: string;
    items: FeedItem[];
  }[];
  if (json && json.length > 0) {
    for (const feed of json) {
      db.feeds.update(feed.url, { lastUpdated: now });
      for (const item of feed.items) {
        // todo: update feeds in db for last update date
        const existingItem = await db.feedItems.get(item.id);
        if (existingItem) {
          continue;
        }

        db.feedItems.add(item);
      }
    }
  }
  return json;
}
async function getFeeds() {
  const feeds = await db.feeds.toArray();
  // Attach resolved properties "feed items" to each feed
  // using parallel queries:
  await Promise.all(
    feeds.map(async feed => {
      const feedItems = await db.feedItems
        .where("feedId")
        .equals(feed.id)
        .filter(item => !item.isRead)
        .toArray();
      feed.items = feedItems;
    }),
  );
  return feeds;
}
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // currently viewed item
  const [selectedItem, setSelectedItem] = useState<FeedItem | undefined>(undefined);
  // current feed
  const [feed, setFeed] = useState<Feed | undefined>(undefined);
  // all feeds
  const feeds = useLiveQuery(getFeeds);
  const configArray = useLiveQuery(() => db.config.toArray());
  const config = configArray && configArray.length > 0 ? configArray[0] : undefined;
  // all feed categories
  const categories = useLiveQuery(() => db.categories.toArray());

  // count all unread feed items
  const countAll = useLiveQuery(() => {
    return db.feedItems.filter(item => !item.isRead).count();
  });

  const hideRead = false; //config?.hideRead;
  const feedUrl = feed?.xmlUrl;

  // current feed items
  const feedItems = useLiveQuery(() => {
    const collection = db.feedItems;
    function filterReadOut(item: FeedItem) {
      if (!hideRead) {
        return true;
      }
      return !item.isRead;
    }
    if (feedUrl) {
      return collection.where("feedId").equals(feedUrl).and(filterReadOut).toArray();
    } else {
      return collection.filter(filterReadOut).toArray();
    }
  }, [feedUrl, hideRead]);

  // set next rss item in the feed as selected item
  const nextItem = () => {
    if (!feedItems) {
      return;
    }
    let index = 0;
    if (selectedItem) {
      index = feedItems.findIndex(item => item.id === selectedItem.id);
    }
    if (index >= 0 && index < feedItems.length - 1) {
      setSelectedItem(feedItems[index + 1]);
    }
  };

  // set previous rss item in the feed as selected item
  const prevItem = () => {
    if (!feedItems) {
      return;
    }
    let index = 0;
    if (selectedItem) {
      index = feedItems.findIndex(item => item.id === selectedItem.id);
    }
    if (index > 0) {
      setSelectedItem(feedItems[index - 1]);
    }
  };

  // TODO: implement all shortcuts
  const escapeListener = useCallback(
    function (e: KeyboardEvent) {
      if (e.key === "Escape" && selectedItem) {
        setSelectedItem(undefined);
      }
    },
    [selectedItem],
  );

  useEffect(() => {
    if (document) {
      document.addEventListener("keyup", escapeListener);
    }
    return () => {
      if (document) {
        document.removeEventListener("keyup", escapeListener);
      }
    };
  }, [escapeListener]);

  const refreshInterval = config?.refreshInterval;
  const refreshFeeds = () => {
    if (!feeds) {
      return;
    }
    return fetchFeeds(feeds, refreshInterval);
  };

  let intervalID: any = 0;
  useEffect(() => {
    intervalID = setInterval(
      () => {
        if (!feeds) {
          return;
        }
        return fetchFeeds(feeds, refreshInterval);
      },
      (refreshInterval || 10) * 1000,
    );
    return () => clearInterval(intervalID);
  }, [feeds, refreshInterval]);

  const value: AppContextValueType = {
    selectedItem,
    feeds,
    config,
    categories,
    feedItems,
    setSelectedItem,
    setFeed,
    feed,
    countAll,
    nextItem,
    prevItem,
    refreshFeeds,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
