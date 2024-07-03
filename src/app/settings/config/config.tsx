"use client";

import { PlusIcon } from "@radix-ui/react-icons";
import { useLiveQuery } from "dexie-react-hooks";
import { FormEvent, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Shortcut from "@/app/settings/config/shortcut";
import FormCheckboxGroup from "@/components/form-checkbox-group";
import FormInputGroup from "@/components/form-input-group";
import { Button } from "@/components/ui/button";
import { getConfig, updateConfig } from "@/lib/db";
import { AppConfig, Shortcut as ShortcutType } from "@/types";

const handleSubmit = (e: FormEvent<HTMLFormElement>, config: AppConfig) => {
  e.preventDefault();
  e.stopPropagation();
  const form = e.currentTarget;
  const formData = new FormData(form);
  const shortcuts: ShortcutType[] = [];
  const configUpdate = {
    ...config,
  };
  formData.forEach((value, field) => {
    if (field.startsWith("shortcuts")) {
      // process shortcuts separately
      const [_, idx, shortCutFieldName] = field.split(".");
      if (!shortcuts.at(+idx)) {
        shortcuts[+idx] = {} as ShortcutType;
      }
      // @ts-ignores
      shortcuts[+idx][shortCutFieldName] = value;
    } else {
      // @ts-ignore
      configUpdate[field] = value;
    }
  });
  configUpdate.shortcuts = shortcuts;
  // console.log({ configUpdate });
  updateConfig(configUpdate);
};

export const Config = ({}) => {
  const config = useLiveQuery(getConfig);

  const [idxState, setIdxState] = useState(0);

  const scArray = useMemo(() => {
    return new Array(idxState).fill(0);
  }, [idxState]);

  useEffect(() => {
    if (!config || !config.shortcuts) {
      return;
    }
    setIdxState(config.shortcuts.length);
  }, [config]);

  if (!config) {
    return null;
  }
  let {
    title = "",
    refreshInterval = 10,
    enableShortcuts = true,
    hideEmptyCategories = true,
    hideEmptyFeeds = true,
    hideRead = true,
    newOnTop = true,
    shortcuts = [],
  } = config;
  return (
    <div className="mt-4 max-w-2xl text-gray-900 dark:text-gray-300">
      <form
        name="config-form"
        onSubmit={e => {
          toast.success("Config saved");
          handleSubmit(e, config);
        }}
      >
        <fieldset name="main" className="space-y-4 rounded-xl border-2 border-gray-700 p-4">
          <legend>Main</legend>
          <FormInputGroup variant="default" value={title} id="title" name="title" label="Title" required />
          <FormInputGroup
            variant="default"
            value={refreshInterval}
            id="refreshInterval"
            name="refreshInterval"
            label="Refresh Interval (in sec)"
          />
          <FormCheckboxGroup id="newOnTop" name="newOnTop" label="New Items on Top" checked={newOnTop} />
          <FormCheckboxGroup id="hideRead" name="hideRead" label="Hide Read Items" checked={hideRead} />
          <FormCheckboxGroup
            id="hideEmptyCategories"
            name="hideEmptyCategories"
            label="Hide Empty Categorie"
            checked={hideEmptyCategories}
          />
          <FormCheckboxGroup
            id="hideEmptyFeeds"
            name="hideEmptyFeeds"
            label="Hide Empty Feeds"
            checked={hideEmptyFeeds}
          />
          <FormCheckboxGroup
            id="enableShortcuts"
            name="enableShortcuts"
            label="Enable Shortcuts"
            checked={enableShortcuts}
          />
        </fieldset>
        <fieldset
          name="shortcuts"
          disabled={!enableShortcuts}
          className="space-y-4 rounded-xl border-2 border-gray-700 p-4"
        >
          <legend>Shortcuts</legend>

          {scArray.map((_, idx) => {
            const sc = shortcuts.at(idx);
            // idxRef.current = idx;
            return (
              <Shortcut
                key={`${sc?.key || "__new__"}-${idx}`}
                idx={idx}
                shortcut={sc}
                onDelete={() => {
                  if (sc) {
                    shortcuts = shortcuts.filter(s => s !== sc);
                  }
                  setIdxState(idxState => idxState - 1);
                }}
              />
            );
          })}
          <div>
            <Button
              variant="link"
              size="icon"
              type="button"
              className=""
              onClick={() => {
                setIdxState(idxState => idxState + 1);
              }}
            >
              <PlusIcon className="h-full w-full" />
            </Button>
          </div>
        </fieldset>
        <Button variant="default" type="submit" className="mt-4 bg-green-500 dark:bg-green-600">
          Save Config
        </Button>
      </form>
    </div>
  );
};

export default Config;
