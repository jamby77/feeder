"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import SelectCategories from "@/app/settings/feeds/add/select-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFeed, db } from "@/lib/db";
import { Feed } from "@/types";

const AddFeedsPage = ({}) => {
  const [details, setDetails] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);
  const fetchFeedDetails = async (url: string) => {
    const response = await fetch(`/api/feed/add?url=${url}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status}`);
    }
    const details = await response.json();
    setDetails(details);
    if (details.title && details.htmlUrl) {
      setIsValid(true);
    }
  };

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
    data.id = data.xmlUrl;
    data.lastUpdated = new Date();
    console.log({ data });
    // todo, validate with zod

    await addFeed(data as Feed);
    if (!details.items) {
      toast.success("Feed added successfully");
      return;
    }
    for (const item of details.items) {
      const existingItem = await db.feedItems.get(item.id);
      if (existingItem) {
        continue;
      }

      db.feedItems.add(item);
    }
    toast.success("Feed and items added successfully");
  }

  return (
    <main className="container w-full">
      <h1 className="py-4 text-4xl uppercase">Add feed</h1>
      <form onSubmit={handleSubmit} className="my-6 flex max-w-lg flex-col gap-4" name="add-feed">
        <input type="hidden" name="type" id="type" defaultValue="rss" />
        <div>
          <Label htmlFor="xmlUrl">Feed Url*</Label>
          <Input
            type="text"
            name="xmlUrl"
            id="xmlUrl"
            placeholder="Feed Url"
            onBlur={e => fetchFeedDetails(e.currentTarget.value)}
          />
        </div>
        <div className="flex items-center">
          <SelectCategories />
        </div>
        {details.title && (
          <div>
            <Label htmlFor="title">Title</Label>
            <Input readOnly type="text" name="title" id="title" defaultValue={details.title} />
            <input type="hidden" name="text" id="text" defaultValue={details.title} />
          </div>
        )}
        {details.htmlUrl && (
          <div>
            <Label htmlFor="title">Web Url</Label>
            <Input readOnly type="text" name="htmlUrl" id="htmlUrl" defaultValue={details.htmlUrl} />
          </div>
        )}
        <Button type="submit" variant="outline" disabled={!isValid}>
          Add
        </Button>
      </form>
    </main>
  );
};

export default AddFeedsPage;
