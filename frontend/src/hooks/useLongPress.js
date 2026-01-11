"use client";

import { useRef } from "react";

export default function useLongPress(callback, ms = 600) {
  const timeout = useRef(null);

  const start = () => {
    timeout.current = setTimeout(() => callback(), ms);
  };

  const stop = () => {
    if (timeout.current) clearTimeout(timeout.current);
  };

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    onTouchMove: stop,
  };
}
