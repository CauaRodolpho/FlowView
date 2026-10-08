"use client";

import type { LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface ExportOption {
  label: string;
  detail: string;
  icon: LucideIcon;
  action: () => void;
}

export function ExportDialog({
  open,
  onOpenChange,
  title,
  description,
  options,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  options: ExportOption[];
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-border bg-popover text-popover-foreground sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                option.action();
                onOpenChange(false);
              }}
              className="rounded-xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:bg-accent"
            >
              <option.icon className="size-5 text-primary" />
              <span className="mt-4 block text-sm font-semibold">{option.label}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{option.detail}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
