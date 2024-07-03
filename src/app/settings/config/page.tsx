import Config from "@/app/settings/config/config";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";

const SettingsConfigPage = () => {
  return (
    <PageContainer>
      <PageTitle title="Configuration" />
      <Config />
    </PageContainer>
  );
};

export default SettingsConfigPage;
