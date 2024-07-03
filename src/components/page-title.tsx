import { H2 } from "@/components/typography/typography";

export const PageTitle = ({ title }: { title: string }) => {
  return <H2 className="capitalize">{title}</H2>;
};

export default PageTitle;
