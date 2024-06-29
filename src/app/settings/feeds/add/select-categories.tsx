"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCategories } from "@/lib/db";

export const SelectCategories = ({}) => {
  const categories = useLiveQuery(getCategories);
  const [checked, setChecked] = useState<string[]>([]);
  if (!categories) {
    return null;
  }
  return (
    <>
      <input type="hidden" name="categories" value={checked.join(",")} id="categories" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">Categories</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          {categories.map(category => (
            <DropdownMenuCheckboxItem
              checked={checked.includes(category.id)}
              key={category.id}
              onSelect={e => e.preventDefault()}
              onCheckedChange={() => {
                if (checked.includes(category.id)) {
                  setChecked(checked.filter(c => c !== category.id));
                } else {
                  setChecked([...checked, category.id]);
                }
              }}
            >
              {category.title}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="px-2 text-xs uppercase md:px-4">{checked.join(", ")}</div>
    </>
  );
};

export default SelectCategories;
