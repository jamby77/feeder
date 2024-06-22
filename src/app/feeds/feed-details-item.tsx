import { useEffect } from "react";
import DOMPurify from "dompurify";
import Author from "@/app/feeds/item/author";
import Category from "@/app/feeds/item/category";
import Image from "@/app/feeds/item/image";
import PubDate from "@/app/feeds/item/pub-date";
import { useAppContext } from "@/context/AppContext";
import { FeedItem, markRead } from "@/lib/db";

export const FeedDetailsItem = ({
  item,
  toggleRead,
}: {
  item: FeedItem;
  toggleRead: (item: FeedItem | undefined) => void;
}) => {
  const content = DOMPurify.sanitize(item.description || "", { FORBID_TAGS: ["iframe"] });
  useEffect(() => {
    markRead(item);
    toggleRead(item); // will it work?
  }, [item]);
  const { nextItem, prevItem } = useAppContext();
  return (
    <div className="absolute bottom-0 left-8 right-0 top-0 place-content-center overflow-hidden overflow-y-auto rounded-l-2xl border-l-2 bg-white drop-shadow-2xl md:left-48">
      <button
        type="button"
        onClick={() => {
          prevItem();
        }}
      >
        Previous
      </button>
      <div className="mx-auto flex max-w-lg flex-col md:max-w-2xl lg:max-w-4xl">
        <div className="">
          <a href={item.link} target="_blank" className="text-lg uppercase hover:underline">
            {item.title} 🔗
          </a>
        </div>
        <div className="meta text-sm text-gray-400">
          <PubDate item={item} />
          <Author item={item} />
          <Category item={item} />
        </div>
        <Image item={item} />
        <div
          className="prose prose-stone mt-4 max-h-[500px] w-full overflow-hidden overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <button
        type="button"
        onClick={() => {
          nextItem();
        }}
      >
        Next
      </button>
    </div>
  );
};
