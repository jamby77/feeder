"use client";

import { Share2Icon } from "@radix-ui/react-icons";
import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import { db } from "@/lib/db";
import { buildFeedsExportData, buildFeedsOPMLXml } from "@/lib/feeds";
import { Feed } from "@/types";

const ExportFeedsPage = ({}) => {
  const feeds = useLiveQuery(() => db.feeds.toArray(), [], [] as Feed[]);
  const xml = useMemo(() => buildFeedsOPMLXml(feeds), [feeds]);
  const json = useMemo(() => buildFeedsExportData(feeds), [feeds]);
  return (
    <div>
      <h2 className="text-3xl text-gray-900 dark:text-gray-300">Export</h2>
      <div className="my-4 grid grid-cols-2 gap-4 md:my-6 md:gap-6">
        <a
          className="text-sm uppercase hover:underline"
          download="feeds.opml.xml"
          href={`data:text/xml;charset=utf-8,${encodeURIComponent(xml)}`}
        >
          <Share2Icon className="mr-2 inline-block h-4 w-4" />
          <span className="inline-block">feeds.opml</span>
        </a>
        <a
          className="text-sm uppercase hover:underline"
          download="feeds.json"
          href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`}
        >
          <Share2Icon className="mr-2 inline-block h-4 w-4" />
          <span className="inline-block">feeds.json</span>
        </a>
      </div>
    </div>
  );
};

export default ExportFeedsPage;
