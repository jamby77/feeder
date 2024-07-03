import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";
import DOMPurify from "dompurify";
import FeedItemImage from "@/app/feeds/item/feedItemImage";
import PubDate from "@/app/feeds/item/pub-date";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeedItemContent } from "@/lib/feeds";
import { cn } from "@/lib/utils";
import { FeedItem } from "@/types";

export const FeedListItem = ({
  item,
  itemIsRead,
  onSelect,
  toggleRead,
}: {
  item: FeedItem;
  itemIsRead: boolean;
  onSelect?: (item: FeedItem | undefined) => void;
  toggleRead?: (item: FeedItem | undefined) => void;
}) => {
  const description = getFeedItemContent(item);
  let content = DOMPurify.sanitize(description, { FORBID_TAGS: ["iframe"] });
  if (content.length > 300) {
    content = content.substring(0, 300) + "...";
  }
  const title = DOMPurify.sanitize(item.title);

  const handleSelect = useCallback(() => {
    return onSelect?.(item);
  }, [onSelect, item]);
  return (
    <li onClick={handleSelect} onFocus={handleSelect}>
      <Card>
        <CardHeader>
          <CardTitle className="flex grow flex-nowrap items-center justify-between">
            <a href={item.link} target="_blank" className="uppercase hover:underline">
              <span dangerouslySetInnerHTML={{ __html: title }} />
            </a>
            <Button
              size="icon"
              variant="ghost"
              className="appearance-none bg-none"
              type="button"
              onClick={() => {
                toggleRead?.(item);
              }}
            >
              {itemIsRead ? <EyeClosedIcon className="w-full" /> : <EyeOpenIcon className="w-full" />}
            </Button>
          </CardTitle>
          <div className="text-muted-foreground">
            <PubDate item={item} />
          </div>
        </CardHeader>
        <CardContent>
          <FeedItemImage item={item} size="small" />
          <div
            className="prose prose-stone mt-4 max-h-[500px] w-full overflow-hidden overflow-y-scroll dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </CardContent>
      </Card>
    </li>
  );
};
