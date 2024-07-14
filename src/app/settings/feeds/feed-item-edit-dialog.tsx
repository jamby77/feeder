import { Pencil2Icon } from "@radix-ui/react-icons";
import { useLiveQuery } from "dexie-react-hooks";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import SelectCategories from "@/app/settings/feeds/add/select-categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db, updatedFeed } from "@/lib/db";
import { validateFeed } from "@/lib/validation";
import { Feed } from "@/types";

export function FeedItemEditDialog({ feedId }: { feedId: string }) {
  const feedItem = useLiveQuery(() => {
    return db.feeds.get(feedId);
  });
  const [open, setOpen] = useState(false);
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data: Record<string, any> = {};
    formData.forEach((value, field) => {
      if (field === "categories" && typeof value === "string") {
        data[field] = value.split(",");
      } else {
        data[field] = value;
      }
    });
    data.id = feedId;
    const [validData, errors] = validateFeed(data);
    if (!validData) {
      toast.error(errors?.formErrors.join("\n") || "Validation error");
      return;
    }
    await updatedFeed(validData as Feed);
    toast.success("Feed updated successfully");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="m-0 p-0" title="Edit feed">
          <Pencil2Icon className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit feed</DialogTitle>
          <DialogDescription>Make changes to your feed here. Click save when you&apos;re done.</DialogDescription>
        </DialogHeader>

        <form className="grid grid-cols-1 gap-4 py-4" name="edit-feed" id="edit-feed" onSubmit={handleSubmit}>
          <input type="hidden" name="type" id="type" defaultValue="rss" />
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="xmlUrl" className="text-right">
              Feed Url*
            </Label>
            <Input
              className="col-span-3"
              type="text"
              name="xmlUrl"
              id="xmlUrl"
              placeholder="Feed Url"
              defaultValue={feedItem?.xmlUrl}
            />
          </div>
          <div className="flex items-center">
            <SelectCategories selectedCategories={feedItem?.categories} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="title">
              Title
            </Label>
            <Input className="col-span-3" type="text" name="title" id="title" defaultValue={feedItem?.title} />
            <input type="hidden" name="text" id="text" defaultValue={feedItem?.title} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right" htmlFor="title">
              Web Url
            </Label>
            <Input className="col-span-3" type="text" name="htmlUrl" id="htmlUrl" defaultValue={feedItem?.htmlUrl} />
          </div>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="destructive" form="edit-feed">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
