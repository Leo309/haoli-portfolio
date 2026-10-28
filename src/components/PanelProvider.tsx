"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

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

export function OpenPanelButton({
  panel,
  className,
  children,
}: {
  panel: PanelId;
  className?: string;
  children: React.ReactNode;
}) {
  const { openPanel } = usePanel();
  return (
    <button type="button" className={className} onClick={() => openPanel(panel)}>
      {children}
    </button>
  );
}
