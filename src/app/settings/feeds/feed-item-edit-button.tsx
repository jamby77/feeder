import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useSettingsFeedsContext } from "@/context/settings-feeds-context";

export function FeedItemEditButton({ feedId }: { feedId: string }) {
  const { setFeedToEdit } = useSettingsFeedsContext();
  return (
    <Button
      onClick={() => {
        setFeedToEdit(feedId);
      }}
      variant="ghost"
      size="icon"
      className="m-0 p-0"
      title="Edit feed"
    >
      <Pencil2Icon className="h-5 w-5" />
    </Button>
  );
}
