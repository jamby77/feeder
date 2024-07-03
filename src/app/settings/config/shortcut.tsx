import { TrashIcon } from "@radix-ui/react-icons";
import toast from "react-hot-toast";
import FormCheckboxGroup from "@/components/form-checkbox-group";
import FormInputGroup from "@/components/form-input-group";
import FormSelectGroup from "@/components/form-select-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
      <FormInputGroup
        id={`title-${keyIdx}`}
        name={mkName("title")}
        label="Shortcut Title"
        value={title}
        variant="vertical"
      />

      <FormSelectGroup id={`command-${keyIdx}`} label="Shortcut Command" variant="vertical">
        <Select defaultValue={command}>
          <SelectTrigger className="w-full" id={`command-${keyIdx}`} name={mkName("command")} defaultValue={command}>
            <SelectValue placeholder="Choose command" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_">None</SelectItem>
            {Object.entries(commands).map(([cmd, txt]) => {
              return (
                <SelectItem key={cmd} value={cmd}>
                  {txt}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </FormSelectGroup>

      <div className="col-span-2 flex flex-row gap-2">
        <div className="flex flex-row items-center gap-2">
          <Label htmlFor={`key-${keyIdx}`}>Shortcut:</Label>
          <Input
            className="w-12 max-w-12 px-4"
            type="text"
            maxLength={1}
            minLength={1}
            id={`key-${keyIdx}`}
            name={mkName("key")}
            defaultValue={key}
          />
        </div>
        <FormCheckboxGroup
          labelSuffix=""
          id={`altKey-${keyIdx}`}
          label="Alt + "
          checked={altKey}
          name={mkName("altKey")}
        />
        <FormCheckboxGroup
          labelSuffix=""
          id={`ctrlKey-${keyIdx}`}
          label="Ctrl + "
          checked={ctrlKey}
          name={mkName("ctrlKey")}
        />
        <FormCheckboxGroup
          labelSuffix=""
          id={`shiftKey-${keyIdx}`}
          label="Shift + "
          checked={shiftKey}
          name={mkName("shiftKey")}
        />
        <FormCheckboxGroup
          labelSuffix=""
          id={`metaKey-${keyIdx}`}
          label="Meta + "
          checked={metaKey}
          name={mkName("metaKey")}
        />
      </div>
      <Button
        variant="destructive"
        size="icon"
        title="Delete Shortcut"
        type="button"
        onClick={() => {
          if (!onDelete) {
            return;
          }
          toast.success("Shortcut deleted");
          return onDelete();
        }}
      >
        <TrashIcon className="m-0 h-5 w-5 p-0" />
      </Button>
    </div>
  );
};

export default Shortcut;
