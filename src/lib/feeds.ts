import { X2jOptions, XMLParser } from "fast-xml-parser";
import { validateFeedItem } from "@/lib/validation";
import { FeedItem } from "@/types";

export function getItemUrl(item: Record<string, any>) {
  const link = item.link || "";
  const url = item.url || "";
  if (!link && url) {
    return url;
  }
  if (typeof link === "object" && link["__attributes"] && link["__attributes"]["@_href"]) {
    return link["__attributes"]["@_href"];
  }
  return link;
}

export function getFeedImage(item: Record<string, any>) {
  let image = item.image || "";
  if (!image) {
    if (item.imageUrl) {
      image = item.imageUrl;
    }

    if (item.featuredImage) {
      image = item.featuredImage;
    }

    // engadget
    if (item["media:content"] && Array.isArray(item["media:content"])) {
      for (const mediaContent of item["media:content"]) {
        if (
          mediaContent["media:keywords"] === "headline" &&
          mediaContent["__attributes"] &&
          mediaContent["__attributes"]["@_medium"] === "image"
        ) {
          image = mediaContent["__attributes"]["@_url"];
        }
      }
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
    stopNodes: ["feed.entry.content"],
    allowBooleanAttributes: true,
    attributesGroupName: "__attributes",
    parseAttributeValue: true,
    parseTagValue: true,
    ignoreDeclaration: true,
  };
  const parser = new XMLParser(parserOptions);
  return parser.parse(xml);
}

function getFeedItemDate(item: Record<string, any>) {
  let pubDateStr = item.pubDate || "";
  if (!pubDateStr && item.updated) {
    // atom (vercel)
    pubDateStr = item.updated;
  }
  return pubDateStr.trim().length > 0 ? new Date(pubDateStr) : new Date();
}

export function getFeedItemContent(item: Record<string, any>) {
  let description = item.description || "";
  if (description && typeof description === "object" && description["#text"]) {
    description = description["#text"].trim();
  } else if (item.content && typeof item.content === "object" && item.content["#text"]) {
    description = item.content["#text"].trim();
  } else if (item.summary && typeof item.summary === "object" && item.summary["#text"]) {
    description = item.summary["#text"].trim();
  }
  return description;
}

function buildFeedItem(feedId: string, item: Record<string, any>): FeedItem {
  const title = item.title || "";

  const image = getFeedImage(item);
  const description = getFeedItemContent(item);
  let link = getItemUrl(item);
  const pubDate = getFeedItemDate(item);
  const [feedItem, error] = validateFeedItem({
    id: link,
    feedId,
    title,
    description,
    pubDate,
    link,
    image,
    isRead: false,
  });

  if (error || !feedItem) {
    console.error(error);
    return {} as FeedItem;
  }
  for (const field in item) {
    if (!(field in feedItem)) {
      // @ts-ignore
      feedItem[field as string] = item[field];
    }
  }

  return feedItem;
}
function extractFeedItems(doc: Record<string, any>) {
  let itemsNodes = doc?.rss?.channel?.item ?? doc?.rdf?.channel?.item;
  if (!itemsNodes) {
    itemsNodes = doc?.feed?.entry;
  }
  return itemsNodes;
}

export async function getFeedItems(feedUrl: string) {
  const xml = await fetchFeedContent(feedUrl);

  const doc = parseFeedXml(xml);
  let itemsNodes = extractFeedItems(doc);
  return itemsNodes.map((item: Record<string, any>) => buildFeedItem(feedUrl, item));
}

function getFeedTitle(doc: Record<string, any>): string {
  return doc?.rss?.channel?.title || doc?.rdf?.channel?.title || doc?.feed?.title || "";
}

function getHtmlUrl(doc: Record<string, any>) {
  return doc?.rss?.channel?.link || doc?.rdf?.channel?.link || doc?.feed?.link || "";
}

export async function getFeedDetails(feedUrl: string) {
  const xml = await fetchFeedContent(feedUrl);

  const doc = parseFeedXml(xml);
  const itemsNodes = extractFeedItems(doc);
  return {
    title: getFeedTitle(doc),
    xmlUrl: feedUrl,
    htmlUrl: getHtmlUrl(doc),
    items: itemsNodes.map((item: Record<string, any>) => buildFeedItem(feedUrl, item)),
  };
}
