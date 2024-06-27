"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";

export const FeedsFilters = ({}) => {
  const { categories } = useAppContext();
  return (
    <div className="flex w-full items-start justify-between gap-6">
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="category">Category</Label>
        <Select>
          <SelectTrigger name="category" className="w-full" id="category">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Your Feeds</SelectItem>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {categories?.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <Label htmlFor="feed-name" className="">
          Feed Name
        </Label>
        <Input type="search" name="feed-name" id="feed-name" className="rounded" placeholder="Filter Feeds..." />
      </div>
    </div>
  );
};

export default FeedsFilters;
