"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { db } from "@/lib/db";
import { AppConfig, Category, Feed, FeedItem } from "@/types";

type AppContextValueType = {
  selectedItem: FeedItem | undefined;
  setSelectedItem: (item: FeedItem | undefined) => void;
  feedUrl: string | undefined;
  setFeedUrl: (url: string | undefined) => void;
  feeds: Feed[] | undefined;
  config: AppConfig | undefined;
  categories: Category[] | undefined;
  feedItems: FeedItem[] | undefined;
};
const defaultValue: AppContextValueType = {
  selectedItem: undefined,
  setSelectedItem: (item: FeedItem | undefined) => {},
  feedUrl: undefined,
  setFeedUrl: (url: string | undefined) => {},
  feeds: undefined,
  config: undefined,
  categories: undefined,
  feedItems: undefined,
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

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // currently viewed item
  const [selectedItem, setSelectedItem] = useState<FeedItem | undefined>(undefined);
  // current feedUrl
  const [feedUrl, setFeedUrl] = useState<string | undefined>(undefined);
  // all feeds
  const feeds = useLiveQuery(() => db.feeds.toArray());
  const configArray = useLiveQuery(() => db.config.toArray());
  const config = configArray && configArray.length > 0 ? configArray[0] : undefined;
  // all feed categories
  const categories = useLiveQuery(() => db.categories.toArray());
  const hideRead = config?.hideRead;
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

  useEffect(() => {
    if (feeds && config) {
      // fetchFeeds(feeds, config[0]);
    }
  }, [feeds, config]);

  const value: AppContextValueType = {
    selectedItem,
    feeds,
    config,
    categories,
    feedItems,
    setSelectedItem,
    setFeedUrl,
    feedUrl,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  return useContext(AppContext);
}

export default AppContext;
