import { Metadata } from "next";
import Export from "@/app/settings/feeds/export/export";

export const metadata: Metadata = {
  title: "Export feeds",
};

const ExportFeedsPage = ({}) => {
  return (
    <main className="container w-full">
      <div className="mx-auto h-full w-full p-4 md:max-w-4xl">
        <h1 className="text-3xl text-gray-900 dark:text-gray-300">Export</h1>
        <Export />
      </div>
    </main>
  );
};

export default ExportFeedsPage;
