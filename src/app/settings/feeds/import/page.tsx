import { Metadata } from "next";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";

export const metadata: Metadata = {
  title: "Import feeds",
};

const ImportFeedsPage = ({}) => {
  return (
    <PageContainer>
      <PageTitle title="Import feeds" />
    </PageContainer>
  );
};

export default ImportFeedsPage;
