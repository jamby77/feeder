"use client";

import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { FeedItemDeleteAlert } from "@/app/settings/feeds/feed-item-delete-alert";
import { FeedItemEditDialog } from "@/app/settings/feeds/feed-item-edit-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { db, getTotalCount, getTotalFeedCount, getTotalFeedUnreadCount, getTotalUnreadCount } from "@/lib/db";
import { Feed } from "@/types";

type SettingsFeedsContextType = {
  columns: ColumnDef<FeedItem>[];
  data: FeedItem[];
  feeds: Feed[];
  currentFeedId?: string;
  categoryFilter?: string;
  filterByCategory: (category: string) => void;
  searchFeedName: (search: string) => void;
};
const defaultValue: SettingsFeedsContextType = {
  filterByCategory(category: string): void {},
  searchFeedName(search: string): void {},
  columns: [],
  data: [],
  feeds: [],
  currentFeedId: undefined,
};
const SettingsFeedsContext = createContext<SettingsFeedsContextType>(defaultValue);

interface FeedItem {
  id: string;
  title: string;
  items?: number;
  itemsUnread?: number;
  categories?: string[];
}

const columns: ColumnDef<FeedItem>[] = [
  {
    accessorKey: "id",
    header: ({ table }) => (
      <Checkbox
        className="mx-auto block"
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      const value = row.getValue("id");
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="mx-auto block"
          name="id"
          value={value as string}
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex-1">Feed Name</div>
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const feed = row.original;
      return <div className="max-w-96 truncate md:max-w-[500px]">{feed.title}</div>;
    },
  },
  {
    size: 150,
    accessorKey: "items",
    enableResizing: false,
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex-1">Articles Total</div>
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const feed = row.original;
      return <div className="text-right">{feed.items}</div>;
    },
  },
  {
    size: 110,
    enableResizing: false,
    accessorKey: "itemsUnread",
    header: ({ column }) => {
      return (
        <div
          className="flex w-full cursor-pointer items-center"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <div className="flex-1">Unread</div>
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </div>
      );
    },
    cell: ({ row }) => {
      const feed = row.original;
      return <div className="text-right">{feed.itemsUnread}</div>;
    },
  },
  {
    accessorKey: "actions",
    size: 110,
    header: () => {
      return <div className="pr-2 text-right">Actions</div>;
    },
    cell: ({ row }) => {
      const feed = row.original;
      const id = feed.id;
      return (
        <div className="flex justify-end gap-4">
          <FeedItemDeleteAlert feedId={id} />
          <FeedItemEditDialog feedId={id} />
        </div>
      );
    },
  },
];

export const SettingsFeedsContextProvider = ({ children }: { children: ReactNode }) => {
  const feeds = useLiveQuery(() => db.feeds.toArray(), [], [] as Feed[]);
  const counts = useLiveQuery(
    async () => {
      if (!feeds) {
        return [];
      }
      const countsInternal = await Promise.all(
        feeds.map(async feed => {
          return {
            id: feed.id,
            count: await getTotalFeedCount(feed.id),
            unread: await getTotalFeedUnreadCount(feed.id),
          };
        }),
      );
      const countTotal = await getTotalCount();
      const countTotalUnread = await getTotalUnreadCount();
      countsInternal.push({ id: "all", count: countTotal, unread: countTotalUnread });
      return countsInternal;
    },
    [feeds],
    [],
  );
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");

  const data = useMemo(() => {
    if (!feeds || !Array.isArray(counts) || counts.length === 0) {
      return [];
    }
    return feeds
      .filter(feed => {
        if (categoryFilter && categoryFilter !== "all" && feed.categories?.indexOf(categoryFilter) === -1) {
          return false;
        }
        return !(searchText && feed.title.toLowerCase().indexOf(searchText.toLowerCase()) === -1);
      })
      .map(feed => {
        const feedCounts = counts?.find(c => c.id === feed.id);
        return {
          id: feed.id,
          title: feed.title,
          items: feedCounts?.count || 0,
          itemsUnread: feedCounts?.unread || 0,
          categories: feed.categories,
        };
      });
  }, [counts, feeds, categoryFilter, searchText]);

  const filterByCategory = useCallback(
    (category: string) => {
      setCategoryFilter(category);
    },
    [setCategoryFilter],
  );
  const searchFeedName = useCallback(
    (search: string) => {
      setSearchText(search);
    },
    [setSearchText],
  );
  return (
    <SettingsFeedsContext.Provider
      value={{
        columns,
        data,
        feeds,
        filterByCategory,
        categoryFilter,
        searchFeedName,
      }}
    >
      {children}
    </SettingsFeedsContext.Provider>
  );
};

export const useSettingsFeedsContext = () => {
  return useContext(SettingsFeedsContext);
};
