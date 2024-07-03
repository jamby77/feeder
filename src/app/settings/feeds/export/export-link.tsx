import { Share2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";

export const ExportLink = ({ children, href, fileName }: { children: ReactNode; href: string; fileName?: string }) => {
  return (
    <a className="text-sm uppercase text-green-600 hover:underline" download={fileName} href={href}>
      <Share2Icon className="mr-2 inline-block h-4 w-4" />
      <div className="inline-block">{children}</div>
    </a>
  );
};

export default ExportLink;
