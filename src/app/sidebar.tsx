"use client";

import toast from "react-hot-toast";
import { H3, H4, Small } from "@/components/typography/typography";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { markAllRead } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Category } from "@/types";

export const Sidebar = ({}) => {
  const { refreshFeeds, categories, feeds, setFeed, countAll, countCurrent, feed: currentFeed } = useAppContext();
  return (
    <aside className="bg-app-secondary text-app-foreground flex h-screen max-h-screen-top w-full max-w-96 grow flex-col gap-2 overflow-hidden overflow-y-auto">
      <div className="flex items-center pr-3">
        <H3
          className={cn("mt-3 flex-1 cursor-pointer p-3", {
            "font-bold underline underline-offset-4": currentFeed === undefined,
          })}
          onClick={() => setFeed(undefined)}
        >
          All {countAll ? `(${countAll})` : ""}
        </H3>
        <div className="flex shrink-0 grow-0 gap-2">
          <Button
            size="icon"
            title="Mark Read"
            className="bg-app-accent hover:bg-app relative rounded-full px-3"
            onClick={() => {
              toast.success("All marked read", {});
              markAllRead();
            }}
          >
            <span className="sr-only">mark read</span>
            <span className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" />
              </svg>
            </span>
          </Button>
          <Button
            size="icon"
            title="Refresh"
            className="bg-app-accent hover:bg-app relative rounded-full px-3"
            onClick={() => {
              toast.loading("Refreshing ...", { duration: 5000 });
              refreshFeeds();
            }}
          >
            <span className="sr-only">refresh</span>
            <span className="text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="currentColor"
              >
                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z" />
              </svg>
            </span>
          </Button>
        </div>
      </div>
      {categories &&
        categories?.map((category: Category) => (
          <div key={category.id} className="p-3">
            <H4 className="mt-2">{category.title}</H4>
            <ul className="pt-2">
              {feeds
                ?.filter(feed => feed.categories && feed.categories.includes(category.id))
                .map(feed => {
                  let itemsCount = feed.items?.length ?? 0;
                  if (currentFeed?.id === feed.id && countCurrent) {
                    itemsCount = countCurrent;
                  }
                  return (
                    <li key={feed.id} className="pl-4">
                      <Button
                        size="lg"
                        variant="link"
                        className={cn("text-app-foreground m-0 h-8 p-0 px-0 py-0 hover:font-bold", {
                          "font-bold underline": currentFeed?.id === feed.id,
                        })}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFeed(feed);
                        }}
                      >
                        <Small>{feed.title}</Small>
                        <span>{itemsCount ? ` (${itemsCount})` : ""}</span>
                      </Button>
                      {itemsCount ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 rounded-full px-2 hover:outline"
                          title="Mark Read"
                          onClick={() => {
                            toast.success(`${feed.title} marked read`, {});
                            return markAllRead(feed.xmlUrl);
                          }}
                        >
                          ✔
                        </Button>
                      ) : null}
                    </li>
                  );
                })}
            </ul>
          </div>
        ))}
    </aside>
  );
};

export default Sidebar;
