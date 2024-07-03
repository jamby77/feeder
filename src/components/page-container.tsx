import { ReactNode } from "react";

export const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <main className="container w-full">
      <div className="mx-auto h-full w-full p-4 md:max-w-4xl">{children}</div>
    </main>
  );
};

export default PageContainer;
