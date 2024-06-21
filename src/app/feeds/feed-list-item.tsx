import { useCallback } from "react";
import DOMPurify from "dompurify";
import { FeedItem, markRead, markUnread } from "@/lib/db";

export const FeedListItem = ({
  item,
  onSelect,
}: {
  item: FeedItem;
  onSelect?: (item: FeedItem | undefined) => void;
}) => {
  let content = DOMPurify.sanitize(item.description || "", { FORBID_TAGS: ["iframe"] });
  if (content.length > 300) {
    content = content.substring(0, 300) + "...";
  }
  const handleSelect = useCallback(() => {
    markRead(item);
    return onSelect?.(item);
  }, [onSelect, item]);
  return (
    <li
      onClick={handleSelect}
      onFocus={handleSelect}
      className={`w-full max-w-96 cursor-pointer rounded border p-1 md:max-w-xl md:px-4 md:py-2 ${!item.isRead ? "" : "bg-gray-100 opacity-50"}`}
    >
      <div className="flex flex-nowrap items-start justify-between gap-2">
        <a href={item.link} target="_blank" className="text-lg font-bold uppercase hover:underline">
          {item.title}
        </a>
        <button
          className="h-10 w-10 appearance-none bg-none text-4xl"
          type="button"
          onClick={() => {
            item.isRead ? markUnread(item) : markRead(item);
          }}
        >
          {item.isRead ? "☑️" : "✅"}
        </button>
      </div>
      {item.image && <img className="mt-4" src={item.image} alt={item.title} />}
      <div
        className="prose prose-stone mt-4 max-h-[500px] w-full overflow-hidden overflow-y-scroll"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </li>
  );
};
