import { XMLBuilder } from "fast-xml-parser";
import { setFeedItems } from "@/lib/db";
import { Feed } from "@/types";

let baseUrl = process.env.NEXT_PUBLIC_FEEDER_API_URL ?? "";
if (baseUrl.endsWith("/")) {
  baseUrl = baseUrl.slice(0, -1);
}

const bypass = process.env.NEXT_PUBLIC_VERCEL_SECRET ?? "pass";
const headers = new Headers();
headers.set("x-vercel-protection-bypass", bypass);
headers.set("x-vercel-set-bypass-cookie", "true");

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

export function buildFeedsExportData(feeds: Feed[]) {
  const outline: Record<string, any> = {};

  for (let { htmlUrl, title, xmlUrl, categories } of feeds) {
    const outlineItem = {
      type: "rss",
      text: title,
      title,
      xmlUrl,
      htmlUrl,
    };
    if (categories && categories.length > 0) {
      for (let c of categories) {
        if (!outline[c]) {
          outline[c] = {
            type: "category",
            title: c,
            text: c,
            outline: [],
          };
        }
        outline[c].outline.push(outlineItem);
      }
    } else {
      outline[title] = outlineItem;
    }
  }

  return {
    head: {
      title: "Feeder - Export",
    },
    body: {
      outline: Object.values(outline),
    },
  };
}

export function buildFeedsOPMLXml(feeds: Feed[]) {
  const options = {
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    suppressBooleanAttributes: true,
    attributesGroupName: "__attributes",
    format: true,
    arrayNodeName: "outline",
    suppressUnpairedNodes: false,
  };
  const builder = new XMLBuilder(options);
  const outline: Record<string, any> = {};

  for (let { htmlUrl, title, xmlUrl, categories } of feeds) {
    const outlineItem = {
      __attributes: {
        type: "rss",
        text: title,
        title,
        xmlUrl,
        htmlUrl,
      },
    };
    if (categories && categories.length > 0) {
      for (let c of categories) {
        if (!outline[c]) {
          outline[c] = {
            __attributes: {
              title: c,
              text: c,
            },
            outline: [],
          };
        }
        outline[c].outline.push(outlineItem);
      }
    } else {
      outline[title] = outlineItem;
    }
  }

  const data = {
    "?xml": {
      __attributes: {
        version: "1.0",
        encoding: "UTF-8",
      },
    },
    opml: {
      __attributes: {
        version: "1.1",
      },
      head: {
        title: "Feeder - Export",
      },
      body: {
        outline: Object.values(outline),
      },
    },
  };
  return builder.build(data);
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

export async function fetchFeedDetails(feedUrl: string) {
  const url = new URL(`${baseUrl}/feed/details`);
  url.searchParams.set("feed", feedUrl);
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }
  return response.json();
}

export async function markFeedItemRead(feedUrl: string, itemUrl?: string) {
  const url = new URL(`${baseUrl}/feed/items/read`);
  url.searchParams.set("feed", feedUrl);
  if (itemUrl) {
    url.searchParams.set("feedItem", itemUrl);
  }
  const newHeaders = new Headers(headers);
  newHeaders.set("content-type", "application/json");
  const response = await fetch(url, { method: "put", headers: newHeaders });
  if (!response.ok) {
    throw new Error(`Failed to mark feed item read: ${response.status}`);
  }
}

export async function markFeedItemUnread(feedUrl: string, itemUrl?: string) {
  const url = new URL(`${baseUrl}/feed/items/un-read`);
  url.searchParams.set("feed", feedUrl);
  if (itemUrl) {
    url.searchParams.set("feedItem", itemUrl);
  }
  const newHeaders = new Headers(headers);
  newHeaders.set("content-type", "application/json");
  const response = await fetch(url, { method: "put", headers: newHeaders });
  if (!response.ok) {
    throw new Error(`Failed to mark feed item read: ${response.status}`);
  }
}

export async function fetchFeedConfig() {
  const url = new URL(`${baseUrl}/feeds`);
  console.log({ url });
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }
  return response.json();
}

export async function fetchFeeds(feeds: Feed[], refreshInterval: number = 10) {
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
  try {
    // fetch all feeds from backend, because of CORS issues
    const responses = await Promise.allSettled(
      feedUrls.map(urlStr => {
        const url = new URL(`${baseUrl}/feed/items`);
        url.searchParams.set("feed", urlStr);
        return fetch(url, {
          method: "GET",
          headers,
        });
      }),
    );

    const json = [];
    for (const r of responses) {
      if (r.status === "fulfilled") {
        const data = await r.value.json();
        if (!data || !data[0]) {
          console.log(JSON.stringify(data, null, 2), r.value.url);
          continue;
        }
        const url = data[0].feedId;
        json.push({
          url,
          items: data,
        });
      } else {
        console.table(r);
      }
    }
    await setFeedItems(json, now);
    return json;
  } catch (e) {
    console.error(e);
  }
  return [];
}
