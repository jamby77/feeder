import { useEffect, useMemo } from "react";
import DOMPurify from "dompurify";
import Author from "@/app/feeds/item/author";
import Category from "@/app/feeds/item/category";
import FeedItemImage from "@/app/feeds/item/feedItemImage";
import PubDate from "@/app/feeds/item/pub-date";
import ShortcutHint from "@/app/feeds/shortcut-hint";
import { useAppContext } from "@/context/AppContext";
import { Command } from "@/lib/commands";
import { markRead } from "@/lib/db";
import { getFeedItemContent } from "@/lib/feeds";
import { FeedItem, Shortcut } from "@/types";

export const FeedDetailsItem = ({
  item,
  toggleRead,
}: {
  item: FeedItem;
  toggleRead: (item: FeedItem | undefined) => void;
}) => {
  const description = getFeedItemContent(item);
  const content = DOMPurify.sanitize(description, { FORBID_TAGS: ["iframe"] });
  const title = DOMPurify.sanitize(item.title);
  const { setSelectedItem, config } = useAppContext();
  const { prev, next } = useMemo(() => {
    if (!config) {
      return {} as {
        [key in Command]: Shortcut;
      };
    }
    const { shortcuts } = config;
    return shortcuts.reduce(
      (res, sc) => {
        if (sc.command === "next") {
          res.next = sc;
        }
        if (sc.command === "prev") {
          res.prev = sc;
        }
        return res;
      },
      {} as {
        [key in Command]: Shortcut;
      },
    );
  }, [config]);

  useEffect(() => {
    markRead(item);
    toggleRead(item); // will it work?
  }, [item, toggleRead]);
  const { nextItem, prevItem, feeds } = useAppContext();
  const feed = useMemo(() => feeds?.find(f => f.id === item.feedId), [item.feedId, feeds]);
  return (
    <div className="absolute bottom-0 left-8 right-0 top-0 place-content-center overflow-hidden overflow-y-auto rounded-l-2xl border-l-2 bg-white md:left-48 dark:border-gray-900 dark:bg-gray-600">
      <div className="mx-auto flex h-full max-w-lg flex-col overflow-hidden overflow-y-scroll bg-gray-50 px-4 pb-12 md:max-w-2xl lg:max-w-4xl dark:bg-gray-700">
        <div className="sticky top-0 bg-gray-50 pb-4 pt-12 dark:bg-gray-700" title={item.title}>
          <a
            href={item.link}
            target="_blank"
            className="inline-flex w-full items-center justify-start gap-4 text-lg uppercase hover:underline dark:text-slate-100"
          >
            <span>🔗</span>
            <span className="inline-block max-w-[90%] truncate" dangerouslySetInnerHTML={{ __html: title }} />
          </a>
        </div>
        <div className="meta text-sm text-gray-400">
          <PubDate item={item} />
          <Author item={item} />
          <Category item={item} />
          <div className="w-full max-w-96 truncate text-sm" title={item.feedId}>
            from {feed?.title}
          </div>
        </div>
        <FeedItemImage item={item} />
        <div
          className="prose prose-xl prose-stone mt-4 max-h-[500px] w-full dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <button
        className="absolute left-2 top-2 rounded-full bg-transparent p-6"
        type="button"
        onClick={() => {
          setSelectedItem(undefined);
        }}
      >
        <span className="inline-block h-6 w-6 text-2xl">❌</span>
      </button>
      <div className="absolute left-12 top-1/2 flex flex-col items-center">
        <button
          className="mb-2 h-16 w-16 rounded-full bg-transparent text-gray-400 hover:bg-gray-200"
          type="button"
          onClick={() => {
            prevItem();
          }}
        >
          <span className="sr-only">Previous</span>
          <span className="inline-block h-6 w-6 pl-1 pt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>
          </span>
        </button>
        <ShortcutHint sc={prev} />
      </div>
      <div className="absolute right-12 top-1/2 flex flex-col items-center">
        <button
          className="mb-2 h-16 w-16 rounded-full bg-transparent text-gray-400 hover:bg-gray-200"
          type="button"
          onClick={() => {
            nextItem();
          }}
        >
          <span className="sr-only">Next</span>
          <span className="inline-block h-6 w-6 pr-1 pt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
            >
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>
          </span>
        </button>
        <ShortcutHint sc={next} />
      </div>
    </div>
  );
};
