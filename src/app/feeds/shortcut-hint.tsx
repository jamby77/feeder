import { Shortcut } from "@/types";

export const ShortcutHint = ({ sc }: { sc?: Shortcut }) => {
  if (!sc) {
    return null;
  }
  return (
    <div className="line-clamp-2 flex max-w-40 items-center justify-start gap-1 overflow-hidden text-gray-400">
      <style>
        {`kbd {
      background-color: #eeeee;
      border-radius: 3px;
      border: 1px solid #b4b4b4;
      box-shadow:
      0 1px 1px rgba(0, 0, 0, 0.2),
      0 2px 0 0 rgba(255, 255, 255, 0.7) inset;
      color: rgb(156 163 175);
      display: inline-block;
      font-size: 0.75em;
      font-weight: 700;
      line-height: 1;
      padding: 4px 6px;
      white-space: nowrap;
    }`}
      </style>
      <span className="inline-block h-6 w-6 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
          <path d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z" />
        </svg>
      </span>{" "}
      {sc.metaKey && (
        <span>
          <kbd>Meta</kbd> +{" "}
        </span>
      )}
      {sc.altKey && (
        <span>
          <kbd>Alt</kbd> +{" "}
        </span>
      )}
      {sc.ctrlKey && (
        <span>
          <kbd>Ctrl</kbd> +{" "}
        </span>
      )}
      {sc.shiftKey && (
        <span>
          <kbd>Shift</kbd> +{" "}
        </span>
      )}
      <kbd>{sc.key}</kbd>
    </div>
  );
};

export default ShortcutHint;
