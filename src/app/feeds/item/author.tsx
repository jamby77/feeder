import { Small } from "@/components/typography/typography";
import { FeedItem } from "@/types";

export const Author = ({ item }: { item: FeedItem }) => {
  let author = item["dc:creator"];
  if (!author && item["author"]) {
    if (Array.isArray(item["author"])) {
      author = item["author"].map(a => a.name).join(", ");
    } else {
      author = item["author"]["name"];
    }
  }

  if (typeof author !== "string") {
    return null;
  }

  return <Small>by {author}</Small>;
};

export default Author;
