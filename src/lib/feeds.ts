import { XMLParser } from "fast-xml-parser";
import { FeedItem } from "@/types";

function getItemUrl(item: Element) {
  const link = item.querySelector("link")?.textContent || "";
  const url = item.querySelector("url")?.textContent || "";
  if (!link && url) {
    return url;
  }
  return link;
}

function getFeedImage(item: Element) {
  let image = item.querySelector("image")?.textContent || "";
  if (!image) {
    const imageUrl = item.querySelector("imageUrl")?.textContent || "";
    if (imageUrl) {
      image = imageUrl;
    }
  }
  return image;
}

async function fetchFeedContent(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }
  return response.text();
}
function parseFeedXml(xml: string) {
  const parser = new XMLParser();
  return parser.parse(xml);
}

function buildFeedItem(feedId: string, item: Record<string, any>): FeedItem {
  const title = item.title || "";
  const description = item.description || "";
  const pubDateStr = item.pubContent || "";
  const image = item.image || "";

  let link = item.link || "";
  const url = item.url || "";
  if (!link && url) {
    link = url;
  }
  const publishDate = pubDateStr.trim().length > 0 ? new Date(pubDateStr) : new Date();
  const feedItem = {
    id: link,
    feedId: feedId,
    title,
    description,
    pubDate: publishDate,
    link,
    image,
    isRead: false,
  };
  for (const field in item) {
    if (!(field in feedItem)) {
      // @ts-ignore
      feedItem[field as string] = item[field];
    }
  }
  return feedItem;
}

export async function getFeedItems(feedUrl: string) {
  const xml = await fetchFeedContent(feedUrl);
  const doc = parseFeedXml(xml);
  const itemsNodes = doc?.rss?.channel?.item ?? doc?.rdf?.channel?.item;
  return itemsNodes.map((item: Record<string, any>) => buildFeedItem(feedUrl, item));
}
