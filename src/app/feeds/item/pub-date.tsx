import { FeedItem } from "@/types";

// generate intl date formatter

const dateFormatter = new Intl.DateTimeFormat("bg", {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour12: false,
  hour: "2-digit",
  minute: "2-digit",
});

export const PubDate = ({ item }: { item: FeedItem }) => {
  if (!item.pubDate) {
    return null;
  }
  const date = new Date(item.pubDate);
  const dateStr = dateFormatter.format(date);
  return <div className="text-sm">on {dateStr}</div>;
};

export default PubDate;
