"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
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
    accessorKey: "title",
    header: "Feed Name",
  },
  {
    accessorKey: "items",
    header: "Articles Total",
  },
  {
    accessorKey: "itemsUnread",
    header: "Unread",
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
  console.log({ counts });
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
      };
    });
  }, [counts, feeds]);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
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
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map(row => (
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
