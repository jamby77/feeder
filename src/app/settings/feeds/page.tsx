import FeedsFilters from "@/app/settings/feeds/feeds-filters";
import FeedsList from "@/app/settings/feeds/feeds-list";
import FeedsTitle from "@/app/settings/feeds/feeds-title";
import { SettingsFeedsContextProvider } from "@/context/settings-feeds-context";

const SettingsFeedsPage = () => {
  return (
    <main className="container w-full">
      <div className="mx-auto h-full w-full p-4 md:max-w-4xl">
        <SettingsFeedsContextProvider>
          <FeedsTitle />
          <div className="my-4 md:my-6">
            <FeedsFilters />
          </div>
          <div className="my-4 md:my-6">
            <FeedsList />
          </div>
        </SettingsFeedsContextProvider>
      </div>
    </main>
  );
};

export default SettingsFeedsPage;
