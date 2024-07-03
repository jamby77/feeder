import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Small } from "@/components/typography/typography";
import { FeedItem } from "@/types";

dayjs.extend(relativeTime);

export const PubDate = ({ item }: { item: FeedItem }) => {
  if (!item.pubDate) {
    return null;
  }
  const dateStr = dayjs(item.pubDate).fromNow();
  return <Small>{dateStr}</Small>;
};

export default PubDate;
