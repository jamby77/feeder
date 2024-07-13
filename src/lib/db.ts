import Dexie, { Collection, InsertType, type EntityTable } from "dexie";
import dexieCloud from "dexie-cloud-addon";
import { validateFeedItem } from "@/lib/validation";
import { AppConfig, Category, Feed, FeedItem } from "@/types";

// import data from "../mockData/data.json";

const db = new Dexie("FeederDatabase", { addons: [dexieCloud] }) as Dexie & {
  config: EntityTable<AppConfig, "id">;
  categories: EntityTable<
    Category,
    "id" // primary key "id" (for the typings only)
  >;
  feeds: EntityTable<Feed, "id">;
  feedItems: EntityTable<FeedItem, "id">;
};

// Schema declaration:
db.version(2).stores({
  config: "@id",
  categories: "id", // primary key "id" (for the runtime!)
  feeds: "id, *categories, lastUpdated", // primary key "id" (for the runtime!)
  feedItems: "id, title, pubDate, isRead, feedId", // primary key "id" (for the runtime!)
});

db.cloud.configure({
  databaseUrl: process.env.DEXIE_CLOUD_DB_URL as string,
  nameSuffix: false,
});

// export async function setup() {
//   const existingCategories = await db.categories.toArray();
//   const existingFeeds = await db.feeds.toArray();
//   const existingConfig = await db.config.toArray();
//
//   const { categories, items, ...config } = data;
//   console.log({ existingCategories, existingFeeds, existingConfig });
//   console.log({ config, categories, items });
//   if (!existingCategories.length) {
//     db.categories.bulkPut(categories);
//   }
//   if (!existingFeeds.length) {
//     db.feeds.bulkPut(items);
//   }
//   if (!existingConfig.length) {
//     const appConfig = {
//       ...config,
//       id: 1,
//       shortcuts: config.shortcuts.map(shortcut => ({
//         altKey: false,
//         ctrlKey: false,
//         metaKey: false,
//         shiftKey: false,
//         ...shortcut,
//         command: shortcut.command as Command,
//       })),
//     };
//     db.config.put(appConfig);
//   }
// }

export async function addFeed(feed: Feed) {
  return db.feeds.add(feed, feed.id);
}
export async function updatedFeed(feed: Feed) {
  return db.feeds.put(feed, feed.id);
}

export async function deleteFeed(feedId: string) {
  return db.feeds.delete(feedId);
}

export function updateConfig(config: AppConfig) {
  db.config.update(config.id, { ...config });
}

export function markRead(item: FeedItem) {
  db.feedItems.update(item.id, { isRead: true });
}
export async function markAllRead(feedId?: string) {
  if (feedId) {
    return db.feedItems.where("feedId").equals(feedId).modify({ isRead: true });
  }
  return db.feedItems.update("*", { isRead: true });
}

export function markUnread(item: FeedItem) {
  db.feedItems.update(item.id, { isRead: false });
}

export async function getFeedItem(itemId: string) {
  return db.feedItems.get(itemId);
}

export async function setFeedItems(
  feeds: {
    url: string;
    items: FeedItem[];
  }[],
  now: Date,
) {
  if (feeds && feeds.length > 0) {
    for (const feed of feeds) {
      db.feeds.update(feed.url, { lastUpdated: now });
      for (const item of feed.items) {
        if (!item.id) {
          continue;
        }
        const existingItem = await getFeedItem(item.id);
        if (existingItem) {
          continue;
        }
        const [feedItem, errors] = validateFeedItem(item, true);
        if (!feedItem) {
          console.error(errors);
          continue;
        }
        db.feedItems.add(feedItem);
      }
    }
  }
}
export async function getFeeds() {
  const feeds = await db.feeds.toArray();
  // Attach resolved properties "feed items" to each feed
  // using parallel queries:
  await Promise.all(
    feeds.map(async feed => {
      feed.items = await db.feedItems
        .where("feedId")
        .equals(feed.xmlUrl)
        .filter(item => !item.isRead)
        .toArray();
    }),
  );
  return feeds;
}

export async function getConfig() {
  const config = await db.config.toArray();
  if (config.length === 0) {
    return undefined;
  }
  return config[0];
}

export async function getCategories() {
  return db.categories.toArray();
}

export async function getTotalUnreadCount() {
  return db.feedItems.filter(item => !item.isRead).count();
}

export async function getTotalCount() {
  return db.feedItems.count();
}

export async function getTotalFeedUnreadCount(feedUrl: string) {
  return db.feedItems
    .where("feedId")
    .equals(feedUrl)
    .filter(item => !item.isRead)
    .count();
}

export async function getTotalFeedCount(feedUrl: string) {
  return db.feedItems.where("feedId").equals(feedUrl).count();
}
export async function getFeedItems(feedUrl?: string, hideRead = false) {
  const feedItemsTable = db.feedItems;
  function filterReadOut(item: FeedItem) {
    if (!hideRead) {
      return true;
    }
    return !item.isRead;
  }
  let collection: Collection<FeedItem, string, InsertType<FeedItem, "id">>;
  if (feedUrl) {
    collection = feedItemsTable.where("feedId").equals(feedUrl).and(filterReadOut);
  } else {
    collection = feedItemsTable.filter(filterReadOut);
  }
  console.log("getFeedItems called");
  return collection.reverse().sortBy("pubDate");
}

export { db };
