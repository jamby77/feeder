import { Metadata } from "next";
import FeedsFilters from "@/app/settings/feeds/feeds-filters";
import FeedsList from "@/app/settings/feeds/feeds-list";
import FeedsTitle from "@/app/settings/feeds/feeds-title";
import PageContainer from "@/components/page-container";
import { SettingsFeedsContextProvider } from "@/context/settings-feeds-context";

export const metadata: Metadata = {
  title: "Feeds",
};

const SettingsFeedsPage = () => {
  return (
    <PageContainer>
      <SettingsFeedsContextProvider>
        <FeedsTitle />
        <div className="my-4 md:my-6">
          <FeedsFilters />
        </div>
        <div className="my-4 md:my-6">
          <FeedsList />
        </div>
      </SettingsFeedsContextProvider>
    </PageContainer>
  );
};

export default SettingsFeedsPage;
