"use client";

import { AlertTriangle, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "default";
  icon?: React.ReactNode;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Bestätigen",
  cancelLabel = "Abbrechen",
  variant = "danger",
  icon,
  onConfirm,
}: ConfirmDialogProps) {
  const variantStyles = {
    danger: {
      icon: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      button: "bg-yellow-500 hover:bg-yellow-600 text-white",
    },
    default: {
      icon: "bg-main-color/10 text-main-color",
      button: "bg-main-color hover:opacity-90 text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles.icon}`}>
              {icon ?? <AlertTriangle size={20} />}
            </div>
            <DialogTitle className="text-gray-800 dark:text-gray-100">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-gray-500 dark:text-gray-400 pl-14">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={16} />
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${styles.button}`}
          >
            <Trash2 size={16} />
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
