"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";
import ExportLink from "@/app/settings/feeds/export/export-link";
import { Large } from "@/components/typography/typography";
import { buildFeedsExportCSV } from "@/lib/csv";
import { db } from "@/lib/db";
import { buildFeedsExportData, buildFeedsOPMLXml } from "@/lib/feeds";
import { Feed } from "@/types";

export const Export = ({}) => {
  const feeds = useLiveQuery(() => db.feeds.toArray(), [], [] as Feed[]);
  const xml = useMemo(() => buildFeedsOPMLXml(feeds), [feeds]);
  const json = useMemo(() => buildFeedsExportData(feeds), [feeds]);
  const csv = useMemo(() => buildFeedsExportCSV(feeds), [feeds]);
  return (
    <div className="my-4 grid grid-cols-2 gap-4 md:my-6 md:gap-6">
      <ExportLink fileName="feeds.opml.xml" href={`data:text/xml;charset=utf-8,${encodeURIComponent(xml)}`}>
        <Large>.opml</Large>
      </ExportLink>
      <ExportLink
        fileName="feeds.json"
        href={`data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(json))}`}
      >
        <Large>.json</Large>
      </ExportLink>
      <ExportLink fileName="feeds.csv" href={`data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`}>
        <Large>.csv</Large>
      </ExportLink>
    </div>
  );
};

export default Export;
