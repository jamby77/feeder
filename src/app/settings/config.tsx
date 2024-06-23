"use client";

import { useRef } from "react";
import { useAppContext } from "@/context/AppContext";
import { commands } from "@/lib/commands";
import { Shortcut } from "@/types";

export const Config = ({}) => {
  const { config } = useAppContext();

  const idxRef = useRef(0);
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
          const shortcuts: Shortcut[] = [];
          console.log({ shortcuts });
          const configUpdate = {
            ...config,
          };
          formData.forEach((value, field) => {
            if (field.startsWith("shortcuts")) {
              // process shortcuts separately
              const [_, idx, shortCutFieldName] = field.split(".");
              if (!shortcuts.at(+idx)) {
                shortcuts[+idx] = {} as Shortcut;
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
          {shortcuts.map((sc, idx) => {
            const { key, title, altKey, ctrlKey, command, metaKey, shiftKey } = sc;
            const keyIdx = `${key}-${idx}`;
            const namePrefix = `shortcuts.${idx}`;
            const mkName = (name = "") => `${namePrefix}.${name}`;
            idxRef.current = idx;
            return (
              <div
                key={keyIdx}
                className="space-y-4 border-b-2 border-gray-700 py-4 first:pt-0 last:border-0 last:pb-0"
              >
                <div className="input group flex flex-col">
                  <label htmlFor={`title-${keyIdx}`}>Shortcut Title:</label>
                  <input
                    className="dark:bg-gray-700"
                    type="text"
                    id={`title-${keyIdx}`}
                    name={mkName("title")}
                    defaultValue={title}
                  />
                </div>
                <div className="input group flex flex-col">
                  <label htmlFor={`command-${keyIdx}`}>Shortcut Command:</label>
                  <select
                    className="dark:bg-gray-700"
                    id={`command-${keyIdx}`}
                    name={mkName("command")}
                    defaultValue={command}
                  >
                    {Object.entries(commands).map(([cmd, txt]) => {
                      return (
                        <option key={cmd} value={cmd}>
                          {txt}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="flex flex-row gap-2">
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`key-${keyIdx}`}>Shortcut:</label>
                    <input
                      className="w-12 max-w-12 px-4 dark:bg-gray-700"
                      type="text"
                      maxLength={1}
                      minLength={1}
                      id={`key-${keyIdx}`}
                      name={mkName("key")}
                      defaultValue={key}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`altKey-${keyIdx}`}>Alt + </label>
                    <input type="checkbox" id={`altKey-${keyIdx}`} name={mkName("altKey")} defaultChecked={altKey} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`ctrlKey-${keyIdx}`}>Ctrl + </label>
                    <input type="checkbox" id={`ctrlKey-${keyIdx}`} name={mkName("ctrlKey")} defaultChecked={ctrlKey} />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`shiftKey-${keyIdx}`}>Shift + </label>
                    <input
                      type="checkbox"
                      id={`shiftKey-${keyIdx}`}
                      name={mkName("shiftKey")}
                      defaultChecked={shiftKey}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`metaKey-${keyIdx}`}>Meta + </label>
                    <input type="checkbox" id={`metaKey-${keyIdx}`} name={mkName("metaKey")} defaultChecked={metaKey} />
                  </div>
                </div>
                <button>🗑️</button>
              </div>
            );
          })}
        </fieldset>
        <button type="submit" className="mt-4 w-full rounded-full border px-2 py-1 md:max-w-36 md:px-4 md:py-4">
          Save Config
        </button>
      </form>
    </div>
  );
};

export default Config;
