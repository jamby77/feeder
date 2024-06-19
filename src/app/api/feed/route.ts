import { NextRequest, NextResponse } from "next/server";
import { getFeedItems } from "@/lib/feeds";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const urls = params.getAll("url");
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
