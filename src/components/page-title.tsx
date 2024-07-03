import { H1 } from "@/components/typography/typography";

export const PageTitle = ({ title }: { title: string }) => {
  return <H1 className="capitalize">{title}</H1>;
};

export default PageTitle;
