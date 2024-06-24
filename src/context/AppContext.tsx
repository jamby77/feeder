"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Command } from "@/lib/commands";
import {
  getCategories,
  getConfig,
  getFeedItems,
  getFeeds,
  getTotalFeedUnreadCount,
  getTotalUnreadCount,
  setFeedItems,
} from "@/lib/db";
import { getItemUrl } from "@/lib/feeds";
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
  countCurrent: number | undefined;
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
  countCurrent: undefined,
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
  // pass all feed urls to backend
  const feedUrls = [];
  const now = new Date();
  for (const feed of feeds) {
    const lastUpdated = feed.lastUpdated;
    if (lastUpdated && now.getTime() - lastUpdated.getTime() < refreshInterval) {
      // skip fetching
      continue;
    }
    feedUrls.push(feed.xmlUrl);
  }
  // fetch all feeds from backend, because of CORS issues
  const response = await fetch(`/api/feed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: feedUrls }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch feeds: ${response.status}`);
  }
  const json = (await response.json()) as {
    url: string;
    items: FeedItem[];
  }[];
  await setFeedItems(json, now);
  return json;
}

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // currently viewed item
  const [selectedItem, setSelectedItem] = useState<FeedItem | undefined>(undefined);
  const [sessionItems, setSessionItems] = useState<FeedItem[] | undefined>(undefined);
  // current feed
  const [feed, setFeed] = useState<Feed | undefined>(undefined);
  const feedUrl = feed?.xmlUrl;

  const setFeedCallback = useCallback(
    (newFeed: Feed | undefined) => {
      if (newFeed?.id !== feed?.id) {
        // clear session items when feed changes
        setSessionItems(undefined);
      }
      setFeed(newFeed);
    },
    [feed],
  );
  // all feeds
  const feeds = useLiveQuery(getFeeds);
  const config = useLiveQuery(getConfig);

  const hideRead = config?.hideRead;
  // all feed categories
  const categories = useLiveQuery(getCategories);

  // count all unread feed items
  const countAll = useLiveQuery(getTotalUnreadCount);

  // count current unread feed items
  const countCurrent = useLiveQuery(() => {
    if (!feedUrl) {
      return 0;
    }
    return getTotalFeedUnreadCount(feedUrl);
  }, [feedUrl]);

  // all current feed items
  const feedItems = useLiveQuery(() => {
    return getFeedItems(feedUrl, hideRead);
  }, [feedUrl, hideRead]);

  // set next rss item in the feed as selected item
  const nextItem = useCallback(() => {
    if (!sessionItems) {
      return;
    }
    let index = 0;
    if (selectedItem) {
      index = sessionItems.findIndex(item => item.id === selectedItem.id);
    }
    if (index >= 0 && index < sessionItems.length - 1) {
      setSelectedItem(sessionItems[index + 1]);
    }
  }, [sessionItems, selectedItem]);

  // set previous rss item in the feed as selected item
  const prevItem = useCallback(() => {
    if (!sessionItems) {
      return;
    }
    let index = 0;
    if (selectedItem) {
      index = sessionItems.findIndex(item => item.id === selectedItem.id);
    }
    if (index > 0) {
      setSelectedItem(sessionItems[index - 1]);
    }
  }, [sessionItems, selectedItem]);

  // copy loaded feed items to session feed items
  // only do this on mount
  useEffect(() => {
    if (!feedItems) {
      return;
    }
    if (sessionItems) {
      return;
    }
    setSessionItems([...feedItems]);
  }, [feedItems]);

  // TODO: implement all shortcuts
  const escapeListener = useCallback(
    function (e: KeyboardEvent) {
      if (e.key === "Escape" && selectedItem) {
        setSelectedItem(undefined);
      }
    },
    [selectedItem],
  );
  const refreshInterval = config?.refreshInterval;
  const refreshFeeds = useCallback(async () => {
    if (!feeds) {
      return;
    }
    return fetchFeeds(feeds, refreshInterval);
  }, [feeds, refreshInterval]);
  const command: { [key in Command]: () => void } = useMemo(() => {
    return {
      nextUnread(): void {},
      prevUnread(): void {},
      refresh: refreshFeeds,
      toggleHideEmptyCategories(): void {},
      toggleHideEmptyFeeds(): void {},
      toggleHideRead(): void {},
      toggleNewOnTop(): void {},
      next: nextItem,
      prev: prevItem,
      visitSite: () => {
        if (!selectedItem) {
          return;
        }
        const link = getItemUrl(selectedItem);
        if (!link || !window) {
          return;
        }
        window.open(link, "_blank");
      },
    };
  }, [nextItem, prevItem, refreshFeeds, selectedItem]);

  // register shortcuts
  useEffect(() => {
    let eventListeners: ((e: KeyboardEvent) => void)[] = [];
    if (document) {
      document.addEventListener("keyup", escapeListener);
      if (config) {
        const { shortcuts } = config || [];
        shortcuts.forEach(sc => {
          if (command[sc.command]) {
            eventListeners.push(function (e: KeyboardEvent) {
              e.preventDefault();
              if (e.key !== sc.key) {
                return;
              }
              if (sc.altKey && !e.altKey) {
                return;
              }
              if (sc.ctrlKey && !e.ctrlKey) {
                return;
              }
              if (sc.metaKey && !e.metaKey) {
                return;
              }
              if (sc.shiftKey && !e.shiftKey) {
                return;
              }
              console.log(`running command: ${sc.title}`);
              command[sc.command]();
            });
          }
        });
        eventListeners.forEach(listener => {
          document.addEventListener("keyup", listener);
        });
      }
    }
    return () => {
      if (document) {
        document.removeEventListener("keyup", escapeListener);
        eventListeners.forEach(listener => {
          document.removeEventListener("keyup", listener);
        });
      }
    };
  }, [command, config, escapeListener]);

  useEffect(() => {
    const intervalID = setInterval(
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
    feedItems: sessionItems, // instead of feedItems, show sessionItems
    setSelectedItem,
    setFeed: setFeedCallback,
    feed,
    countAll,
    countCurrent,
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
