import DOMPurify from "dompurify";
import { FeedItem } from "@/lib/db";

export const FeedDisplayItem = ({ item }: { item: FeedItem }) => {
  let content = DOMPurify.sanitize(item.description || "", { FORBID_TAGS: ["iframe"] });

  return (
    <div className="absolute left-8 top-0 h-screen w-full place-content-center rounded-l-2xl border-l-2 bg-white drop-shadow-2xl md:left-48 md:px-4">
      <div className="mx-auto flex max-w-lg flex-col md:max-w-2xl lg:max-w-4xl">
        <div className="flex flex-nowrap items-start justify-between gap-2">
          <a href={item.link} target="_blank" className="text-lg uppercase hover:underline">
            {item.title} 🔗
          </a>
        </div>
        {item.image && <img className="mt-4" src={item.image} alt={item.title} />}
        <div
          className="prose prose-stone mt-4 max-h-[500px] w-full overflow-hidden overflow-y-scroll"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};
