import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { Trash2Icon } from "lucide-react";

interface AlertButtonProps {
  name: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  theme?: "destructive" | "regular" | "red-text";
  id?: string | null
}

export default function AlertButton({
  name,
  onClick,
  theme = "destructive",
  id = null
}: AlertButtonProps) {
  const isDestructive = (theme === "destructive") || (theme === "red-text");

  const themeClass = {
    destructive: `rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white
                  shadow-md transition-colors
                  hover:bg-red-700
                  focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`,

  "red-text": `rounded-md bg-neutral-50 px-4 py-2 text-sm font-medium text-red-600
               transition-colors
               hover:bg-neutral-200
               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2`,

    regular: `rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white
              shadow-md transition-colors
              hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`,
  }[theme];
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <button
          type="button"
          className={`${themeClass} flex items-center gap-2 text-sm`}
        >
          {isDestructive ? <Trash2Icon className="p-1"/> : null}
          {isDestructive ? "Delete" : "Confirm"} {name}
        </button>
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        />

        <AlertDialog.Content
          className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md
                     -translate-x-1/2 -translate-y-1/2
                     rounded-lg bg-white p-6 shadow-xl
                     focus:outline-none"
        >
          <AlertDialog.Title className="text-lg font-semibold text-gray-900">
            Are you absolutely sure?
          </AlertDialog.Title>

          <AlertDialog.Description className="mt-2 text-sm leading-6 text-gray-600">
            {isDestructive
              ? `This action cannot be undone. This will permanently delete the ${name}.`
              : `Are you sure you want to confirm this ${name}?`}
          </AlertDialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <button
                type="button"
                className="rounded-md border border-gray-300 bg-white px-4 py-2
                           text-sm font-medium text-gray-700
                           hover:bg-gray-50
                           focus:outline-none focus:ring-2 focus:ring-gray-400
                           focus:ring-offset-2"
              >
                Cancel
              </button>
            </AlertDialog.Cancel>

            <AlertDialog.Action asChild>
              <button
                id = {id || ""}
                type="button"
                onClick={onClick}
                className={themeClass}
              >
                
                {isDestructive ? "Yes, delete" : "Yes, confirm"} {name}
              </button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}