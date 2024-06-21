import { FeedItem } from "@/types";

export const Image = ({ item }: { item: FeedItem }) => {
  if (!item.image) {
    return null;
  }

  return <img className="mt-4" src={item.image} alt={item.title} />;
};

export default Image;
