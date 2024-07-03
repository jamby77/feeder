import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const HomePage = () => {
  return (
    <main className="flex w-full flex-1">
      <div className="grid w-full flex-1 grid-cols-1 place-items-center gap-4 text-center text-4xl font-bold uppercase text-foreground md:grid-cols-2 md:grid-rows-1 md:gap-16">
        <Card className="border-2">
          <CardContent className="flex h-[400px] w-[400px] items-center justify-center">
            <Link href="/feeds" className="w-full py-40">
              Check Your Feeds
            </Link>
          </CardContent>
        </Card>
        <Card className="border-2">
          <CardContent className="flex h-[400px] w-[400px] items-center justify-center">
            <Link href="/settings" className="w-full py-40">
              Change Your Settings
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default HomePage;
