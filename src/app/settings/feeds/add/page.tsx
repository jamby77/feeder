"use client";

import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import SelectCategories from "@/app/settings/feeds/add/select-categories";
import FormInputGroup from "@/components/form-input-group";
import PageContainer from "@/components/page-container";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFeed, db } from "@/lib/db";
import { fetchFeedDetails } from "@/lib/feeds";
import { validateFeed } from "@/lib/validation";
import { Feed } from "@/types";

const AddFeedsPage = ({}) => {
  const [details, setDetails] = useState<Record<string, any>>({});
  const [isValid, setIsValid] = useState(false);
  const handleInputBlur = async (url: string) => {
    setIsValid(false);
    setDetails({});
    try {
      const details = await fetchFeedDetails(url);
      setDetails(details);
      if (details.title && details.htmlUrl) {
        setIsValid(true);
      }
    } catch (e) {
      console.error(e);
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
    const [validData, errors] = validateFeed(data);
    if (!validData) {
      toast.error(errors?.formErrors.join("\n") || "Validation error");
      return;
    }
    await addFeed(validData as Feed);
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
    <PageContainer>
      <PageTitle title="Add feed" />
      <form onSubmit={handleSubmit} className="my-6 flex max-w-lg flex-col gap-4" name="add-feed">
        <input type="hidden" name="type" id="type" defaultValue="rss" />
        <div className="flex flex-col gap-2">
          <Label htmlFor="xmlUrl">Feed Url*</Label>
          <Input
            type="text"
            name="xmlUrl"
            id="xmlUrl"
            placeholder="Feed Url"
            onBlur={e => handleInputBlur(e.currentTarget.value)}
          />
        </div>
        {details.title && (
          <>
            <FormInputGroup name="title" id="title" value={details.title} label="Title" variant="vertical" />
            <input type="hidden" name="text" id="text" defaultValue={details.title} />
          </>
        )}
        {details.htmlUrl && (
          <FormInputGroup
            readonly
            name="htmlUrl"
            id="htmlUrl"
            value={details.htmlUrl}
            label="Web Url"
            variant="vertical"
          />
        )}

        <div className="flex items-center">
          <SelectCategories disabled={!isValid} />
        </div>
        <Button type="submit" variant="outline" disabled={!isValid}>
          Add
        </Button>
      </form>
    </PageContainer>
  );
};

export default AddFeedsPage;
