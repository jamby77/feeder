import { Share2Icon } from "@radix-ui/react-icons";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export const ExportLink = ({ children, href, fileName }: { children: ReactNode; href: string; fileName?: string }) => {
  return (
    <Card className="h-96 w-96">
      <CardContent className="grid aspect-square place-items-center">
        <a
          className="flex h-64 w-64 items-center justify-center rounded-xl border border-gray-300 text-sm uppercase text-green-600 shadow hover:border-2 hover:font-bold hover:underline"
          download={fileName}
          href={href}
        >
          <Share2Icon className="mr-2 inline-block h-4 w-4" />
          <div className="inline-block">{children}</div>
        </a>
      </CardContent>
    </Card>
  );
};

export default ExportLink;
