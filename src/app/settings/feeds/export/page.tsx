import { Metadata } from "next";
import Export from "@/app/settings/feeds/export/export";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";

export const metadata: Metadata = {
  title: "Export feeds",
};

const ExportFeedsPage = ({}) => {
  return (
    <PageContainer>
      <PageTitle title="Export feeds" />
      <Export />
    </PageContainer>
  );
};

export default ExportFeedsPage;
