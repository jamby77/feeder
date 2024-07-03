import { Small } from "@/components/typography/typography";
import { FeedItem } from "@/types";

export const Category = ({ item }: { item: FeedItem }) => {
  if (!item["category"]) {
    return null;
  }
  let category = item.category;
  if (Array.isArray(category)) {
    category = category.join(", ");
  }
  return (
    <Small className="w-full max-w-96 truncate" title={category}>
      in {category}
    </Small>
  );
};

export default Category;
