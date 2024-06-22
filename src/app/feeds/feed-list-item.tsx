import { useCallback } from "react";
import DOMPurify from "dompurify";
import FeedItemImage from "@/app/feeds/item/feedItemImage";
import { FeedItem } from "@/lib/db";
import { getFeedItemContent } from "@/lib/feeds";

export const FeedListItem = ({
  item,
  itemIsRead,
  onSelect,
  toggleRead,
}: {
  item: FeedItem;
  itemIsRead: boolean;
  onSelect?: (item: FeedItem | undefined) => void;
  toggleRead?: (item: FeedItem | undefined) => void;
}) => {
  const description = getFeedItemContent(item);
  let content = DOMPurify.sanitize(description, { FORBID_TAGS: ["iframe"] });
  if (content.length > 300) {
    content = content.substring(0, 300) + "...";
  }
  const title = DOMPurify.sanitize(item.title);

  const handleSelect = useCallback(() => {
    return onSelect?.(item);
  }, [onSelect, item]);
  return (
    <li
      onClick={handleSelect}
      onFocus={handleSelect}
      className={`w-full max-w-96 cursor-pointer rounded border p-1 md:max-w-xl md:px-4 md:py-2 dark:border-gray-900 ${!itemIsRead ? "" : "bg-gray-100 opacity-50 dark:bg-gray-700"}`}
    >
      <div className="flex flex-nowrap items-start justify-between gap-2">
        <a
          href={item.link}
          target="_blank"
          className="prose prose-stone text-lg font-bold uppercase dark:prose-invert hover:underline"
        >
          <span dangerouslySetInnerHTML={{ __html: title }} />
        </a>
        <button
          className="h-10 w-10 appearance-none bg-none text-4xl"
          type="button"
          onClick={() => {
            toggleRead?.(item);
          }}
        >
          {itemIsRead ? "☑️" : "✅"}
        </button>
      </div>
      <FeedItemImage item={item} />
      <div
        className="prose prose-stone mt-4 max-h-[500px] w-full overflow-hidden overflow-y-scroll dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </li>
  );
};
