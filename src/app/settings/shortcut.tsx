import toast from "react-hot-toast";
import { commands } from "@/lib/commands";
import { Shortcut as ShortcutType } from "@/types";

export const Shortcut = ({
  shortcut,
  idx,
  onDelete,
}: {
  shortcut?: ShortcutType;
  idx: number;
  onDelete?: () => void;
}) => {
  let sc = shortcut ?? ({} as ShortcutType);
  const { key = "__new__", title, altKey, ctrlKey, command, metaKey, shiftKey } = sc;
  const keyIdx = `${key}-${idx}`;
  const namePrefix = `shortcuts.${idx}`;
  const mkName = (name = "") => `${namePrefix}.${name}`;
  return (
    <div className="grid grid-cols-2 grid-rows-3 place-items-start gap-4 border-b-2 border-gray-700 py-4 first:pt-0 last:border-0 last:pb-0">
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
        <select className="dark:bg-gray-700" id={`command-${keyIdx}`} name={mkName("command")} defaultValue={command}>
          {Object.entries(commands).map(([cmd, txt]) => {
            return (
              <option key={cmd} value={cmd}>
                {txt}
              </option>
            );
          })}
        </select>
      </div>

      <div className="col-span-2 flex flex-row gap-2">
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
          <input type="checkbox" id={`shiftKey-${keyIdx}`} name={mkName("shiftKey")} defaultChecked={shiftKey} />
        </div>
        <div className="flex flex-row items-center gap-2">
          <label htmlFor={`metaKey-${keyIdx}`}>Meta + </label>
          <input type="checkbox" id={`metaKey-${keyIdx}`} name={mkName("metaKey")} defaultChecked={metaKey} />
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          if (!onDelete) {
            return;
          }
          toast.success("Shortcut deleted");
          return onDelete();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#5f6368">
          <path d="M267.33-120q-27.5 0-47.08-19.58-19.58-19.59-19.58-47.09V-740H160v-66.67h192V-840h256v33.33h192V-740h-40.67v553.33q0 27-19.83 46.84Q719.67-120 692.67-120H267.33Zm425.34-620H267.33v553.33h425.34V-740Zm-328 469.33h66.66v-386h-66.66v386Zm164 0h66.66v-386h-66.66v386ZM267.33-740v553.33V-740Z" />
        </svg>
      </button>
    </div>
  );
};

export default Shortcut;
