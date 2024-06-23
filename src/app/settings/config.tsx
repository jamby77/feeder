"use client";

import { useEffect, useReducer } from "react";
import { useAppContext } from "@/context/AppContext";
import { commands } from "@/lib/commands";
import { AppConfig, Shortcut } from "@/types";

enum ConfigChange {
  UPDATE_SHORTCUT = "UPDATE_SHORTCUT",
  ADD_SHORTCUT = "ADD_SHORTCUT",
  DELETE_SHORTCUT = "DELETE_SHORTCUT",
  UPDATE = "UPDATE",
  SET = "SET",
}

type SetPayload = {
  config: AppConfig;
};
type UpdateFieldPayload = {
  field: string;
  value: any;
};

type DeleteShortcutPayload = {
  key: string;
};

type UpdateShortcutPayload = {
  key: string;
  field: string;
  value: any;
};

type ReducerAction =
  | {
      type: ConfigChange.UPDATE;
      payload: UpdateFieldPayload;
    }
  | {
      type: ConfigChange.UPDATE_SHORTCUT;
      payload: UpdateShortcutPayload;
    }
  | {
      type: ConfigChange.DELETE_SHORTCUT;
      payload: DeleteShortcutPayload;
    }
  | {
      type: ConfigChange.ADD_SHORTCUT;
    }
  | {
      type: ConfigChange.SET;
      payload: SetPayload;
    };

const reducer = (state: AppConfig, action: ReducerAction) => {
  switch (action.type) {
    case ConfigChange.UPDATE:
      const field = action.payload.field;
      return { ...state, [field]: action.payload.value };
    case ConfigChange.ADD_SHORTCUT:
      const sc: Shortcut = {
        altKey: false,
        command: "next",
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
        title: "",
        key: "",
      };
      return { ...state, shortcuts: [...state.shortcuts, sc] };
    case ConfigChange.DELETE_SHORTCUT: {
      const shortcuts = state.shortcuts.filter(sc => sc.key !== action.payload.key);
      return { ...state, shortcuts };
    }
    case ConfigChange.UPDATE_SHORTCUT: {
      const { key, field, value } = action.payload;
      const shortcuts = state.shortcuts.map((sc, idx) => {
        if (`${sc.key}-${idx}` !== key) {
          return sc;
        }
        return { ...sc, [field]: value };
      });
      return { ...state, shortcuts };
    }

    case ConfigChange.SET:
      return { ...action.payload.config };
  }
  return state;
};

export const Config = ({}) => {
  const { config } = useAppContext();

  const [state, dispatch] = useReducer(reducer, config || ({} as AppConfig));
  useEffect(() => {
    console.log("config changed");
    if (!config) {
      return;
    }
    dispatch({ type: ConfigChange.SET, payload: { config } });
  }, [config]);
  const {
    title = "",
    refreshInterval = 10,
    enableShortcuts = true,
    hideEmptyCategories = true,
    hideEmptyFeeds = true,
    hideRead = true,
    newOnTop = true,
    shortcuts = [],
  } = state;
  return (
    <div className="max-w-2xl text-gray-900 dark:text-gray-300">
      <form name="config-form">
        <fieldset name="main" className="space-y-4 rounded-xl border-2 border-gray-700 p-4">
          <legend>Main</legend>
          <div className="input group flex flex-col">
            <label htmlFor="title">Title:</label>
            <input
              className="dark:bg-gray-700"
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={e => {
                const value = e.target.value;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field: "title",
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-col">
            <label htmlFor="refreshInterval">Refresh Interval (in sec):</label>
            <input
              className="dark:bg-gray-700"
              type="number"
              id="refreshInterval"
              name="refreshInterval"
              value={refreshInterval}
              onChange={e => {
                const value = +e.target.value;
                if (isNaN(value)) {
                  console.log("Invalid number");
                  return;
                }
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field: "refreshInterval",
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="newOnTop">New Items on Top:</label>
            <input
              type="checkbox"
              id="newOnTop"
              name="newOnTop"
              checked={newOnTop}
              onChange={e => {
                const value = e.target.checked;
                const field = e.target.name;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field,
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideRead">Hide Read Items:</label>
            <input
              type="checkbox"
              id="hideRead"
              name="hideRead"
              checked={hideRead}
              onChange={e => {
                const value = e.target.checked;
                const field = e.target.name;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field,
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideEmptyCategories">Hide Empty Categories:</label>
            <input
              type="checkbox"
              id="hideEmptyCategories"
              name="hideEmptyCategories"
              checked={hideEmptyCategories}
              onChange={e => {
                const value = e.target.checked;
                const field = e.target.name;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field,
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="hideEmptyFeeds">Hide Empty Feeds:</label>
            <input
              type="checkbox"
              id="hideEmptyFeeds"
              name="hideEmptyFeeds"
              checked={hideEmptyFeeds}
              onChange={e => {
                const value = e.target.checked;
                const field = e.target.name;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field,
                    value,
                  },
                });
              }}
            />
          </div>
          <div className="input group flex flex-row gap-2">
            <label htmlFor="enableShortcuts">Enable Shortcuts:</label>
            <input
              type="checkbox"
              id="enableShortcuts"
              name="enableShortcuts"
              checked={enableShortcuts}
              onChange={e => {
                const value = e.target.checked;
                const field = e.target.name;
                // console.log("change title", value);
                dispatch({
                  type: ConfigChange.UPDATE,
                  payload: {
                    field,
                    value,
                  },
                });
              }}
            />
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
                    name="title"
                    value={title}
                    onChange={e => {
                      let value = e.target.value;

                      const field = e.target.name;
                      // console.log("change title", value);
                      dispatch({
                        type: ConfigChange.UPDATE_SHORTCUT,
                        payload: { field, value, key: keyIdx },
                      });
                    }}
                  />
                </div>
                <div className="input group flex flex-col">
                  <label htmlFor={`command-${keyIdx}`}>Shortcut Command:</label>
                  <select
                    className="dark:bg-gray-700"
                    id={`command-${keyIdx}`}
                    name="command"
                    value={command}
                    onChange={e => {
                      let value = e.target.value;

                      const field = e.target.name;
                      console.log({
                        field,
                        value,
                      });
                      dispatch({
                        type: ConfigChange.UPDATE_SHORTCUT,
                        payload: { field, value, key: keyIdx },
                      });
                    }}
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
                      name="key"
                      value={key}
                      onChange={e => {
                        let value = e.target.value;
                        if (value.length > 1) {
                          // shortcut key max 1 char length
                          value = value[0];
                        }
                        const field = e.target.name;
                        // console.log("change title", value);
                        dispatch({
                          type: ConfigChange.UPDATE_SHORTCUT,
                          payload: {
                            field,
                            value,
                            key: keyIdx,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`altKey-${keyIdx}`}>Alt + </label>
                    <input
                      type="checkbox"
                      id={`altKey-${keyIdx}`}
                      name="altKey"
                      checked={altKey}
                      onChange={e => {
                        const value = e.target.checked;
                        const field = e.target.name;
                        // console.log("change title", value);
                        dispatch({
                          type: ConfigChange.UPDATE_SHORTCUT,
                          payload: {
                            field,
                            value,
                            key: keyIdx,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`ctrlKey-${keyIdx}`}>Ctrl + </label>
                    <input
                      type="checkbox"
                      id={`ctrlKey-${keyIdx}`}
                      name="ctrlKey"
                      checked={ctrlKey}
                      onChange={e => {
                        const value = e.target.checked;
                        const field = e.target.name;
                        // console.log("change title", value);
                        dispatch({
                          type: ConfigChange.UPDATE_SHORTCUT,
                          payload: {
                            field,
                            value,
                            key: keyIdx,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`shiftKey-${keyIdx}`}>Shift + </label>
                    <input
                      type="checkbox"
                      id={`shiftKey-${keyIdx}`}
                      name="shiftKey"
                      checked={shiftKey}
                      onChange={e => {
                        const value = e.target.checked;
                        const field = e.target.name;
                        // console.log("change title", value);
                        dispatch({
                          type: ConfigChange.UPDATE_SHORTCUT,
                          payload: {
                            field,
                            value,
                            key: keyIdx,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="flex flex-row items-center gap-2">
                    <label htmlFor={`metaKey-${keyIdx}`}>Meta + </label>
                    <input
                      type="checkbox"
                      id={`metaKey-${keyIdx}`}
                      name="metaKey"
                      checked={metaKey}
                      onChange={e => {
                        const value = e.target.checked;
                        const field = e.target.name;
                        // console.log("change title", value);
                        dispatch({
                          type: ConfigChange.UPDATE_SHORTCUT,
                          payload: {
                            field,
                            value,
                            key: keyIdx,
                          },
                        });
                      }}
                    />
                  </div>
                </div>
                <button>🗑️</button>
              </div>
            );
          })}
        </fieldset>
      </form>
    </div>
  );
};

export default Config;
