import Palette from "@/app/settings/palette/palette";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";

const PalettePage = () => {
  return (
    <PageContainer>
      <PageTitle title="Palette" />
      <Palette />
    </PageContainer>
  );
};

export default PalettePage;
