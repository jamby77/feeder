import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FeedItem } from "@/types";

dayjs.extend(relativeTime);

export const PubDate = ({ item }: { item: FeedItem }) => {
  if (!item.pubDate) {
    return null;
  }
  const date = new Date(item.pubDate);
  const dateStr = dayjs(date).fromNow();
  return <div className="text-sm">published {dateStr}</div>;
};

export default PubDate;
