import FeedsItemsList from "@/app/feeds/feeds-items-list";

const FeedsPage = ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
  let feedUrl = searchParams["feed"] || "";
  const feedTitle = searchParams["title"] || "";
  if (Array.isArray(feedUrl)) {
    feedUrl = feedUrl[0];
  }
  return (
    <div>
      <h1 className="py-4 text-center text-2xl">{feedTitle || feedUrl}</h1>
      <FeedsItemsList feedUrl={feedUrl} />
    </div>
  );
};

export default FeedsPage;
