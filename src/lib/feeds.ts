import { X2jOptions, XMLParser } from "fast-xml-parser";
import { FeedItem } from "@/types";

function getItemUrl(item: Record<string, any>) {
  const link = item.link || "";
  const url = item.url || "";
  if (!link && url) {
    return url;
  }
  return link;
}

function getFeedImage(item: Record<string, any>) {
  let image = item.image || "";
  if (!image) {
    if (item.imageUrl) {
      image = item.imageUrl;
    }

    if (item.featuredImage) {
      image = item.featuredImage;
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
  const parserOptions: X2jOptions = {
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    attributesGroupName: "__attributes",
    parseAttributeValues: true,
    parseTagValues: true,
  };
  const parser = new XMLParser(parserOptions);
  return parser.parse(xml);
}

function getFeedItemDate(item: Record<string, any>) {
  const pubDateStr = item.pubContent || "";
  return pubDateStr.trim().length > 0 ? new Date(pubDateStr) : new Date();
}

function buildFeedItem(feedId: string, item: Record<string, any>): FeedItem {
  const title = item.title || "";
  const description = item.description || "";
  const image = getFeedImage(item);

  let link = getItemUrl(item);
  const pubDate = getFeedItemDate(item);
  const feedItem = {
    id: link,
    feedId: feedId,
    title,
    description,
    pubDate,
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
