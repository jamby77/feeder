import { FeedItem } from "@/types";

export const Author = ({ item }: { item: FeedItem }) => {
  if (!item["dc:creator"]) {
    return null;
  }

  return <div className="text-sm">by {item["dc:creator"]}</div>;
};

export default Author;
