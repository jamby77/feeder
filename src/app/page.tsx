import Link from "next/link";

const HomePage = () => {
  return (
    <main className="flex w-full flex-1">
      <div className="grid w-full flex-1 grid-cols-1 place-items-center gap-4 text-center text-4xl font-bold uppercase text-gray-600 md:grid-cols-2 md:grid-rows-1 md:gap-16">
        <div className="flex h-[400px] w-[400px] items-center justify-center rounded-lg border-8 border-gray-700 bg-gray-500/25 backdrop-blur-lg">
          <Link href="/feeds" className="w-full py-40">
            Check Your Feeds
          </Link>
        </div>
        <div className="flex h-[400px] w-[400px] items-center justify-center rounded-lg border-8 border-gray-700 bg-gray-500/25 backdrop-blur-lg">
          <Link href="/settings" className="w-full py-40">
            Change Your Settings
          </Link>
        </div>
      </div>
    </main>
  );
};

export default HomePage;
