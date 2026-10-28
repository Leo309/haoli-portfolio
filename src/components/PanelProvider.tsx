"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { trackEvent, type EventName } from "@/lib/analytics";

export type PanelId = "ask" | "inquiry";

interface PanelContextValue {
  open: PanelId | null;
  openPanel: (id: PanelId) => void;
  closePanel: () => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

// One panel at a time: opening "inquiry" from inside AskHao simply swaps the panel
export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<PanelId | null>(null);
  const openPanel = useCallback((id: PanelId) => setOpen(id), []);
  const closePanel = useCallback(() => setOpen(null), []);
  const value = useMemo(() => ({ open, openPanel, closePanel }), [open, openPanel, closePanel]);

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;
}

export function usePanel(): PanelContextValue {
  const context = useContext(PanelContext);
  if (!context) throw new Error("usePanel must be used inside <PanelProvider>");
  return context;
}

// Each panel's opener is its conversion event, so buttons don't need to repeat it
const OPEN_EVENT: Record<PanelId, EventName> = { inquiry: "work_with_me_click", ask: "ask_open" };

export function OpenPanelButton({
  panel,
  className,
  event = OPEN_EVENT[panel],
  children,
}: {
  panel: PanelId;
  className?: string;
  event?: EventName;
  children: React.ReactNode;
}) {
  const { openPanel } = usePanel();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        trackEvent(event);
        openPanel(panel);
      }}
    >
      {children}
    </button>
  );
}
