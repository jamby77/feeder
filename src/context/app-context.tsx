"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Command } from "@/lib/commands";
import {
  getCategories,
  getConfig,
  getFeedItems,
  getFeeds,
  getTotalFeedUnreadCount,
  getTotalUnreadCount,
} from "@/lib/db";
import { fetchFeedConfig, fetchFeeds, getItemUrl } from "@/lib/feeds";
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
  setSelectedItem: (_item: FeedItem | undefined) => {},
  feed: undefined,
  setFeed: (_feed: Feed | undefined) => {},
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

const skipTags = ["input", "textarea"];

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  // currently viewed item
  const [selectedItem, setSelectedItem] = useState<FeedItem | undefined>(undefined);
  const [sessionItems, setSessionItems] = useState<FeedItem[] | undefined>(undefined);
  // current feed
  const [feed, setFeed] = useState<Feed | undefined>(undefined);
  const feedUrl = feed?.xmlUrl;

  // all feeds
  const feeds = useLiveQuery(getFeeds);
  const config = useLiveQuery(getConfig);

  const setFeedCallback = useCallback(
    (newFeed: Feed | undefined) => {
      if (newFeed?.id !== feed?.id) {
        // clear session items when feed changes
        setSessionItems(undefined);
      } else {
        getFeedItems(newFeed?.xmlUrl, config?.hideRead).then(feedItems => {
          setSessionItems([...feedItems]);
        });
      }
      setFeed(newFeed);
    },
    [config?.hideRead, feed?.id],
  );

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
      toast("No session items");
      return;
    }
    let index = 0;
    if (selectedItem) {
      index = sessionItems.findIndex(item => item.id === selectedItem.id);
    } else {
      setSelectedItem(sessionItems[0]);
      return;
    }
    if (index >= 0 && index < sessionItems.length - 1) {
      setSelectedItem(sessionItems[index + 1]);
    } else if (index === 0 && !selectedItem && sessionItems.length) {
      // if nothing is currently selected and try to navigate to next item, start from the beginning
      setSelectedItem(sessionItems[0]);
    }
    if (index === sessionItems.length - 1) {
      toast("No next unread items");
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
    } else if (index === 0 && !selectedItem && sessionItems.length) {
      // if nothing is currently selected and try to navigate to prev item, start from the end
      setSelectedItem(sessionItems.at(-1));
    } else {
      toast("No previous unread items");
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
    if (!feeds || feeds.length === 0) {
      console.warn("no feeds found, fetching list from BE");
      const feedsConfig = await fetchFeedConfig();
      console.log({ feedsConfig });
      return;
    }
    return fetchFeeds(feeds, refreshInterval);
  }, [feeds, refreshInterval]);
  const command: { [key in Command]: () => void } = useMemo(() => {
    return {
      nextUnread(): void {},
      prevUnread(): void {},
      refresh: () => {
        toast.loading("Refreshing ...", { duration: 5000 });
        return refreshFeeds();
      },
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
    const eventListeners: ((e: KeyboardEvent) => void)[] = [escapeListener];
    if (document) {
      if (config) {
        const { shortcuts } = config || [];
        shortcuts.forEach(sc => {
          if (command[sc.command]) {
            eventListeners.push(function (e: KeyboardEvent) {
              const { key, isComposing, isTrusted, target } = e;
              const { tagName } = target as HTMLElement;
              if (
                skipTags.includes(tagName.toLowerCase()) ||
                !isTrusted ||
                isComposing ||
                key !== sc.key ||
                (sc.altKey && !e.altKey) ||
                (sc.ctrlKey && !e.ctrlKey) ||
                (sc.metaKey && !e.metaKey) ||
                (sc.shiftKey && !e.shiftKey)
              ) {
                return;
              }
              e.preventDefault();
              // toast(<span style={{ textTransform: "capitalize" }}>running command: {sc.title}</span>, {
              //   duration: 300,
              // });
              command[sc.command]();
            });
          }
        });
        eventListeners.forEach(listener => {
          document.addEventListener("keyup", listener);
        });
      } else {
        console.log("config missing");
      }
    }
    return () => {
      if (document) {
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
