import { Cross2Icon, ExternalLinkIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useMemo, useRef } from "react";
import DOMPurify from "dompurify";
import Author from "@/app/feeds/item/author";
import Category from "@/app/feeds/item/category";
import FeedItemImage from "@/app/feeds/item/feedItemImage";
import PubDate from "@/app/feeds/item/pub-date";
import ShortcutHint from "@/app/feeds/shortcut-hint";
import { Lead, Small } from "@/components/typography/typography";
import { useAppContext } from "@/context/app-context";
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
  const { setSelectedItem, config } = useAppContext();
  const description = getFeedItemContent(item);
  const content = DOMPurify.sanitize(description, { FORBID_TAGS: ["iframe"] });
  const title = DOMPurify.sanitize(item.title);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { prev, next } = useMemo(() => {
    if (!config) {
      return {} as {
        [key in Command]: Shortcut;
      };
    }
    const { shortcuts } = config;
    return shortcuts.reduce(
      (res, sc) => {
        if (sc.command === "next" && !res.next) {
          res.next = sc;
        }
        if (sc.command === "prev" && !res.prev) {
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
  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scroll({ top: 0, behavior: "smooth" });
  }, [item]);

  const selfRef = useRef<HTMLDivElement>(null);

  const onOutsideClickListener = useCallback(
    function (e: MouseEvent) {
      const path = e.composedPath();
      if (!selfRef.current || !path.includes(selfRef.current)) {
        setSelectedItem(undefined);
      }
    },
    [setSelectedItem],
  );
  useEffect(() => {
    document.addEventListener("click", onOutsideClickListener);
    return () => {
      document.removeEventListener("click", onOutsideClickListener);
    };
  }, [onOutsideClickListener]);
  const { nextItem, prevItem, feeds } = useAppContext();
  const feed = useMemo(() => feeds?.find(f => f.xmlUrl === item.feedId), [item.feedId, feeds]);
  return (
    <div
      ref={selfRef}
      className="bg-background absolute top-0 right-0 bottom-0 left-8 place-content-center overflow-hidden rounded-l-2xl border-l-4 md:left-48"
    >
      <div
        ref={scrollRef}
        className="mx-auto my-1 flex h-full max-w-lg flex-col overflow-hidden overflow-y-auto pb-12 shadow-lg md:max-w-2xl lg:max-w-5xl"
      >
        <div className="bg-background sticky top-0 mb-4 border-b-2 px-4 pt-12 pb-4 backdrop-blur-sm" title={item.title}>
          <a
            href={item.link}
            target="_blank"
            className="text-foreground inline-flex w-full items-center justify-start gap-4 text-lg uppercase hover:underline"
          >
            <ExternalLinkIcon className="h-6 w-6" />
            <Lead className="inline-block max-w-[90%] truncate" dangerouslySetInnerHTML={{ __html: title }} />
          </a>
        </div>
        <div className="text-muted-foreground space-y-1.5 px-4">
          <PubDate item={item} />
          <Author item={item} />
          <Category item={item} />
          <Small className="w-full max-w-96 truncate" title={item.feedId}>
            in {feed?.title}
          </Small>
        </div>
        <div className="px-4">
          <FeedItemImage item={item} size="large" />
        </div>
        <div
          className="prose prose-xl prose-stone dark:prose-invert mt-4 mb-16 w-full px-4 text-pretty"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
      <button
        className="absolute top-2 left-2 rounded-full bg-transparent p-6"
        type="button"
        onClick={() => {
          setSelectedItem(undefined);
        }}
      >
        <span className="inline-block h-6 w-6 text-2xl">
          <Cross2Icon className="h-6 w-6" />
        </span>
      </button>
      <div className="absolute top-1/2 left-12 flex flex-col items-center">
        <button
          className="mb-2 h-16 w-16 rounded-full bg-transparent text-gray-400 hover:bg-gray-200"
          type="button"
          onClick={() => {
            prevItem();
          }}
        >
          <span className="sr-only">Previous</span>
          <span className="inline-block h-6 w-6 pt-1 pl-1">
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
      <div className="absolute top-1/2 right-12 flex flex-col items-center">
        <button
          className="mb-2 h-16 w-16 rounded-full bg-transparent text-gray-400 hover:bg-gray-200"
          type="button"
          onClick={() => {
            nextItem();
          }}
        >
          <span className="sr-only">Next</span>
          <span className="inline-block h-6 w-6 pt-1 pr-1">
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
