import toast from "react-hot-toast";
import { Small } from "@/components/typography/typography";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { markAllRead } from "@/lib/db";
import { cn } from "@/lib/utils";
import { Feed } from "@/types";

type SidebarItemProps = {
  feed: Feed;
};
export const SidebarItem = ({ feed }: SidebarItemProps) => {
  const { setFeed, countCurrent, feed: currentFeed } = useAppContext();
  let itemsCount = feed.items?.length ?? 0;
  if (currentFeed?.id === feed.id && countCurrent) {
    itemsCount = countCurrent;
  }
  return (
    <li key={feed.id} className="pl-4">
      <Button
        size="lg"
        variant="link"
        className={cn("m-0 h-8 p-0 px-0 py-0 text-app-foreground hover:font-bold", {
          "font-bold underline": currentFeed?.id === feed.id,
        })}
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          setFeed(feed);
        }}
      >
        <Small>{feed.title}</Small>
        <span>{itemsCount ? ` (${itemsCount})` : ""}</span>
      </Button>
      {itemsCount ? (
        <Button
          size="sm"
          variant="ghost"
          className="ml-2 rounded-full px-2 hover:outline"
          title="Mark Read"
          onClick={() => {
            toast.success(`${feed.title} marked read`, {});
            return markAllRead(feed.xmlUrl);
          }}
        >
          ✔
        </Button>
      ) : null}
    </li>
  );
};
