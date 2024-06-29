import { NextRequest, NextResponse } from "next/server";
import { getFeedDetails } from "@/lib/feeds";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const url = params.get("url") ?? "";
  if (!url) {
    return NextResponse.json(
      {
        error: "No url provided",
      },
      {
        status: 400,
      },
    );
  }
  const feedDetails = await getFeedDetails(url);

  return NextResponse.json(feedDetails);
}
