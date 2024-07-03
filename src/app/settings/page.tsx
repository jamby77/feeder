import { redirect } from "next/navigation";
import Config from "@/app/settings/config/config";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";

const SettingsPage = () => {
  redirect("/settings/config");
  return (
    <PageContainer>
      <PageTitle title="Configuration" />
      <Config />
    </PageContainer>
  );
};

export default SettingsPage;
