import { getFeedImage } from "@/lib/feeds";
import { FeedItem } from "@/types";

export const FeedItemImage = ({ item }: { item: FeedItem }) => {
  const image = getFeedImage(item);
  if (!image) {
    return null;
  }

  return <img className="mt-4" src={image} alt={item.title} />;
};

export default FeedItemImage;
