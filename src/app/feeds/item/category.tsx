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
    <div className="w-full max-w-96 truncate text-sm" title={category}>
      in {category}
    </div>
  );
};

export default Category;
