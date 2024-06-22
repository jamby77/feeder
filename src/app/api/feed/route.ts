import { NextRequest, NextResponse } from "next/server";
import { getFeedItems } from "@/lib/feeds";

export async function POST(request: NextRequest) {
  const params = await request.json();
  const urls = params["url"] as string[];
  const feedPromises = [];
  for (const feed of urls) {
    feedPromises.push(getFeedItems(feed));
  }
  const feedsItems = await Promise.allSettled(feedPromises);

  return NextResponse.json(
    feedsItems.map((feedItem, index) => ({
      url: urls[index],
      items: feedItem.status === "fulfilled" ? feedItem.value : [],
    })),
  );
}
