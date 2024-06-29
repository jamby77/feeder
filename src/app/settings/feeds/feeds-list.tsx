"use client";

import { CaretSortIcon, Pencil2Icon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo, useState } from "react";
import { FeedItemDeleteAlert } from "@/app/settings/feeds/feed-item-delete-alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db, getTotalCount, getTotalFeedCount, getTotalFeedUnreadCount, getTotalUnreadCount } from "@/lib/db";

interface FeedCol {
  id: string;
  title: string;
  items?: number;
  itemsUnread?: number;
}

const columns: ColumnDef<FeedCol>[] = [
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
    accessorKey: "items",
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
    accessorKey: "id",
    header: () => {
      return (
        <div>
          <div className="flex-1">Actions</div>
        </div>
      );
    },
    cell: ({ row }) => {
      const feed = row.original;
      const id = feed.id;
      return (
        <div className="flex gap-4">
          <FeedItemDeleteAlert feedId={id} />
          <Button variant="ghost" className="m-0 p-0" title="Edit feed">
            <Pencil2Icon className="h-5 w-5" />
          </Button>
        </div>
      );
    },
  },
];

const FeedsList = () => {
  const feeds = useLiveQuery(() => db.feeds.toArray());

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

  const data = useMemo(() => {
    if (!feeds || !Array.isArray(counts) || counts.length === 0) {
      return [];
    }
    return feeds.map(feed => {
      const feedCounts = counts?.find(c => c.id === feed.id);
      return {
        id: feed.id,
        title: feed.title,
        items: feedCounts?.count || 0,
        itemsUnread: feedCounts?.unread || 0,
        categories: feed.categories,
      };
    });
  }, [counts, feeds]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { getHeaderGroups, getRowModel } = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });
  console.log({ sorting });
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {getRowModel().rows?.length ? (
            getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FeedsList;
