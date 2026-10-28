"use client";

import { useEffect, useRef } from "react";
import { usePanel, type PanelId } from "./PanelProvider";

// A native <dialog> opened with showModal(): the browser gives us Esc-to-close,
// a focus trap and an inert page behind it, which are easy to get wrong by hand.
export default function Panel({ id, title, children }: { id: PanelId; title: string; children: React.ReactNode }) {
  const { open, closePanel } = usePanel();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Remember what opened the panel so keyboard users land back there on close
  const openerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open === id && !dialog.open) {
      openerRef.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (open !== id && dialog.open) {
      dialog.close();
    }
  }, [open, id]);

  function handleClose() {
    if (open === id) closePanel();
    openerRef.current?.focus();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-panel-title`}
      onClose={handleClose}
      // A click that lands on the <dialog> itself (not its content) is a click on the backdrop
      onClick={(event) => event.target === dialogRef.current && closePanel()}
      className="panel fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-dvh w-full max-w-full border-l border-line bg-canvas p-0 text-ink shadow-[0_0_40px_rgb(38_37_31/0.18)] backdrop:bg-ink/25 sm:max-w-[440px]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id={`${id}-panel-title`} className="text-[15px] font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={closePanel}
            aria-label="Close"
            className="flex size-10 items-center justify-center rounded-lg text-xl text-muted transition-colors hover:bg-card hover:text-ink"
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </dialog>
  );
}
