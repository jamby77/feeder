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
  const description = getFeedItemContent(item);
  const content = DOMPurify.sanitize(description, { FORBID_TAGS: ["iframe"] });
  const title = DOMPurify.sanitize(item.title);
  const scrollRef = useRef<HTMLDivElement>(null);
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
      console.log({ current: selfRef.current, path });
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
      className="absolute bottom-0 left-8 right-0 top-0 place-content-center overflow-hidden overflow-y-auto rounded-l-2xl border-l-4 bg-background md:left-48"
    >
      <div
        ref={scrollRef}
        className="mx-auto flex h-full max-w-lg flex-col overflow-hidden overflow-y-scroll bg-muted px-4 pb-12 md:max-w-2xl lg:max-w-4xl"
      >
        <div className="sticky top-0 mb-4 border-b-2 bg-accent pb-4 pt-12 backdrop-blur" title={item.title}>
          <a
            href={item.link}
            target="_blank"
            className="inline-flex w-full items-center justify-start gap-4 text-lg uppercase text-foreground hover:underline"
          >
            <ExternalLinkIcon className="h-6 w-6" />
            <Lead className="inline-block max-w-[90%] truncate" dangerouslySetInnerHTML={{ __html: title }} />
          </a>
        </div>
        <div className="space-y-1.5 text-muted-foreground">
          <PubDate item={item} />
          <Author item={item} />
          <Category item={item} />
          <Small className="w-full max-w-96 truncate" title={item.feedId}>
            in {feed?.title}
          </Small>
        </div>
        <FeedItemImage item={item} size="large" />
        <div
          className="prose prose-xl prose-stone mb-16 mt-4 w-full dark:prose-invert"
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
        <span className="inline-block h-6 w-6 text-2xl">
          <Cross2Icon className="h-6 w-6" />
        </span>
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
