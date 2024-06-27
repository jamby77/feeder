import FeedsFilters from "@/app/settings/feeds/feeds-filters";
import FeedsList from "@/app/settings/feeds/feeds-list";
import FeedsTitle from "@/app/settings/feeds/feeds-title";
import { DataTableDemo } from "@/app/settings/feeds/test";

const SettingsFeedsPage = () => {
  return (
    <main className="container w-full">
      <div className="mx-auto h-full w-full p-4 md:max-w-4xl">
        <FeedsTitle />
        <div className="my-4 md:my-6">
          <FeedsFilters />
        </div>
        <div className="my-4 md:my-6">
          <FeedsList />
        </div>
      </div>
    </main>
  );
};

export default SettingsFeedsPage;
