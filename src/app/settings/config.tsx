"use client";

import { useEffect, useMemo, useState } from "react";
import Shortcut from "@/app/settings/shortcut";
import { useAppContext } from "@/context/AppContext";
import { Shortcut as ShortcutType } from "@/types";

export const Config = ({}) => {
  const { config } = useAppContext();

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
  const {
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
    <div className="max-w-2xl text-gray-900 dark:text-gray-300">
      <form
        name="config-form"
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          const form = e.target as HTMLFormElement;
          const formData = new FormData(form);
          const shortcuts: ShortcutType[] = [];
          console.log({ shortcuts });
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
          console.log({ configUpdate });
        }}
      >
        <fieldset name="main" className="space-y-4 rounded-xl border-2 border-gray-700 p-4">
          <legend>Main</legend>
          <div className="input group flex flex-col">
            <label htmlFor="title">Title:</label>
            <input className="dark:bg-gray-700" type="text" id="title" name="title" defaultValue={title} />
          </div>
          <div className="input group flex flex-col">
            <label htmlFor="refreshInterval">Refresh Interval (in sec):</label>
            <input
              className="dark:bg-gray-700"
              type="number"
              id="refreshInterval"
              name="refreshInterval"
              defaultValue={refreshInterval}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="newOnTop">New Items on Top:</label>
            <input type="checkbox" id="newOnTop" name="newOnTop" defaultChecked={newOnTop} />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideRead">Hide Read Items:</label>
            <input type="checkbox" id="hideRead" name="hideRead" defaultChecked={hideRead} />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideEmptyCategories">Hide Empty Categories:</label>
            <input
              type="checkbox"
              id="hideEmptyCategories"
              name="hideEmptyCategories"
              defaultChecked={hideEmptyCategories}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideEmptyFeeds">Hide Empty Feeds:</label>
            <input type="checkbox" id="hideEmptyFeeds" name="hideEmptyFeeds" defaultChecked={hideEmptyFeeds} />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="enableShortcuts">Enable Shortcuts:</label>
            <input type="checkbox" id="enableShortcuts" name="enableShortcuts" defaultChecked={enableShortcuts} />
          </div>
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
            return <Shortcut key={`${sc?.key || "__new__"}-${idx}`} idx={idx} shortcut={sc} />;
          })}
          <div>
            <button
              type="button"
              className="ml-auto block h-16 w-16 rounded-full bg-gray-500 p-2 text-4xl leading-none text-blue-400 shadow-xl backdrop-blur"
              onClick={() => {
                setIdxState(idxState => idxState + 1);
              }}
            >
              +
            </button>
          </div>
        </fieldset>
        <button type="submit" className="mt-4 w-full rounded-full border px-2 py-1 md:max-w-36 md:px-4 md:py-4">
          Save Config
        </button>
      </form>
    </div>
  );
};

export default Config;
