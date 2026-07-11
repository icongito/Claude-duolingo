"use client";

import { useEffect } from "react";

/** Registers the service worker in production builds only. */
export function SwRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      typeof navigator === "undefined" ||
      !("serviceWorker" in navigator)
    ) {
      return;
    }
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Registration failure (e.g. private mode) — the app works without it.
    });
  }, []);

  return null;
}
