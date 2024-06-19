"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useState } from "react";
import { Category, db, Feed, FeedItem, setup } from "@/lib/db";
import { AppConfig } from "@/types";

const HomePage = () => {
  const feeds = useLiveQuery(() => db.feeds.toArray());
  const config = useLiveQuery(() => db.config.toArray());
  const categories = useLiveQuery(() => db.categories.toArray());

  async function fetchFeeds(feeds: Feed[], config: AppConfig) {
    if (!feeds || !config) {
      console.warn("no feeds found");
      return;
    }
    const refreshInterval = config.refreshInterval;
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
    // const response = await fetch(`/api/feed?${feedUrls.toString()}`);
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
  useEffect(() => {
    if (feeds && config) {
      // fetchFeeds(feeds, config[0]);
    }
  }, [feeds, config]);
  useEffect(() => {
    // setup();
  }, []);
  return (
    <main>
      <h1 className="text-6xl">Home page</h1>
      <div className="space-y-2">
        {categories &&
          categories?.map((category: Category) => (
            <div key={category.id}>
              <h2 className="text-xl">{category.title}</h2>
              <ul className="space-y-1 pt-2">
                {feeds
                  ?.filter(feed => feed.categories && feed.categories.includes(category.id))
                  .map(feed => (
                    <li key={feed.id} className="ps-4">
                      <a href={feed.htmlUrl}>{feed.title}</a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
      </div>
    </main>
  );
};

export default HomePage;
