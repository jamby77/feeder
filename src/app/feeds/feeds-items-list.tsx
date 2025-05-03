"use client";

import { useCallback, useEffect, useState } from "react";
import { FeedDetailsItem } from "@/app/feeds/feed-details-item";
import { FeedListItem } from "@/app/feeds/feed-list-item";
import { useAppContext } from "@/context/app-context";
import { markRead, markUnread } from "@/lib/db";
import { FeedItem } from "@/types";

export const FeedsItemsList = () => {
  const { feedItems, selectedItem, setSelectedItem } = useAppContext();
  const [readState, setReadState] = useState<{ [key: string]: boolean }>({});
  // set initial read state
  useEffect(() => {
    if (feedItems) {
      setReadState(
        feedItems.reduce(
          (acc, item) => {
            acc[item.id] = item.isRead;
            return acc;
          },
          {} as { [key: string]: boolean },
        ),
      );
    }
  }, [feedItems]);

  // set read state when item is selected
  useEffect(() => {
    if (selectedItem && !readState[selectedItem.id]) {
      setReadState({
        ...readState,
        [selectedItem.id]: true,
      });
    }
  }, [readState, selectedItem]);
  const selectCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item) {
        return;
      }
      markRead(item);
      setReadState({
        ...readState,
        [item.id]: true,
      });
      setSelectedItem(item);
    },
    [readState, setSelectedItem],
  );
  const toggleReadCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item) {
        return;
      }
      if (readState[item.id]) {
        markUnread(item);
      } else {
        markRead(item);
      }
      setReadState({
        ...readState,
        [item.id]: !readState[item.id],
      });
    },
    [readState],
  );
  const setReadCallback = useCallback(
    (item: FeedItem | undefined) => {
      if (!item || readState[item.id]) {
        return;
      }
      setReadState({
        ...readState,
        [item.id]: true,
      });
    },
    [readState],
  );

  return (
    <div className="w-full">
      <ul className="max-h-screen-top flex w-full flex-col gap-2 overflow-y-auto p-2 md:gap-4 md:p-6">
        {feedItems?.map(item => {
          return (
            <FeedListItem
              item={item}
              key={item.id}
              toggleRead={toggleReadCallback}
              itemIsRead={readState[item.id]}
              onSelect={selectCallback}
            />
          );
        })}
        {feedItems?.length === 0 && (
          <li className="w-full py-16">
            <p className="text-muted-foreground/90 text-center text-2xl">No feeds found</p>
            <div className="text-muted-foreground/75 mx-auto mt-4 max-w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                className="animate-tik-tak inline-block h-12 w-12 fill-current"
              >
                <path d="M320-160h320v-120q0-66-47-113t-113-47q-66 0-113 47t-47 113v120Zm160-360q66 0 113-47t47-113v-120H320v120q0 66 47 113t113 47ZM160-80v-80h80v-120q0-61 28.5-114.5T348-480q-51-32-79.5-85.5T240-680v-120h-80v-80h640v80h-80v120q0 61-28.5 114.5T612-480q51 32 79.5 85.5T720-280v120h80v80H160Z" />
              </svg>
            </div>
          </li>
        )}
      </ul>
      {selectedItem && <FeedDetailsItem item={selectedItem} toggleRead={setReadCallback} />}
    </div>
  );
};

export default FeedsItemsList;
