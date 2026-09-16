"use client";

import { useCallback, useState, type MouseEvent } from "react";

export interface TipState {
  visible: boolean;
  x: number;
  y: number;
  label: string;
  value: string;
}

const HIDDEN: TipState = { visible: false, x: 0, y: 0, label: "", value: "" };

export function useTooltip() {
  const [tip, setTip] = useState<TipState>(HIDDEN);

  const showTip = useCallback((e: MouseEvent, label: string, value: string) => {
    setTip({ visible: true, x: e.clientX, y: e.clientY, label, value });
  }, []);

  const hideTip = useCallback(() => setTip((t) => ({ ...t, visible: false })), []);

  return { tip, showTip, hideTip };
}
