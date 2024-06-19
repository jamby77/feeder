import Dexie, { type EntityTable } from "dexie";
import { AppConfig, Category, Command, Feed, FeedItem } from "@/types";
import data from "../mockData/data.json";

const db = new Dexie("FeederDatabase") as Dexie & {
  config: EntityTable<AppConfig>;
  categories: EntityTable<
    Category,
    "id" // primary key "id" (for the typings only)
  >;
  feeds: EntityTable<Feed, "id">;
  feedItems: EntityTable<FeedItem, "id">;
};

// Schema declaration:
db.version(2).stores({
  config: "++id",
  categories: "id", // primary key "id" (for the runtime!)
  feeds: "id, *categories, lastUpdated", // primary key "id" (for the runtime!)
  feedItems: "id, title, pubDate, isRead, feed", // primary key "id" (for the runtime!)
});

export async function setup() {
  const existingCategories = await db.categories.toArray();
  const existingFeeds = await db.feeds.toArray();
  const existingConfig = await db.config.toArray();

  const { categories, items, ...config } = data;
  console.log({ existingCategories, existingFeeds, existingConfig });
  console.log({ config, categories, items });
  if (!existingCategories.length) {
    db.categories.bulkPut(categories);
  }
  if (!existingFeeds.length) {
    db.feeds.bulkPut(items);
  }
  if (!existingConfig.length) {
    const appConfig = {
      ...config,
      id: 1,
      shortcuts: config.shortcuts.map(shortcut => ({
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        ...shortcut,
        command: shortcut.command as Command,
      })),
    };
    db.config.put(appConfig);
  }
}

export async function getFeeds() {
  if (!db) {
    console.log("db not found");
    return;
  }

  return db.feeds.toArray();
}

export type { Category, Feed, FeedItem };
export { db };
