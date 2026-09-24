"use client";

import React, { useSyncExternalStore, useRef } from "react";
import { usePathname } from "next/navigation";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("pageshow", callback);
  window.addEventListener("popstate", callback);
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pageshow", callback);
    window.removeEventListener("popstate", callback);
    mediaQuery.removeEventListener("change", callback);
  };
}

function getSnapshot() {
  if (typeof window === "undefined") return false;
  const saved = localStorage.getItem("theme");
  if (saved) return saved === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}

let previewPlayedForDocument = false;

export function ThemeToggle() {
  const pathname = usePathname();
  const isDark = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const previewTimerRef = useRef<number | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    window.dispatchEvent(new Event("storage"));
  }, [pathname]);

  React.useEffect(() => {
    if (pathname !== "/") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (previewPlayedForDocument) return;

    const button = buttonRef.current;
    if (!button) return;

    const finishPreview = (event: AnimationEvent) => {
      if (event.animationName === "theme-preview-thumb") {
        button.classList.remove("is-previewing");
      }
    };
    button.addEventListener("animationend", finishPreview);
    previewTimerRef.current = window.setTimeout(() => {
      previewPlayedForDocument = true;
      button.classList.add("is-previewing");
      previewTimerRef.current = null;
    }, 1100);

    return () => {
      if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
      button.classList.remove("is-previewing");
      button.removeEventListener("animationend", finishPreview);
    };
  }, [pathname]);

  const toggleTheme = () => {
    if (previewTimerRef.current !== null) window.clearTimeout(previewTimerRef.current);
    previewTimerRef.current = null;
    buttonRef.current?.classList.remove("is-previewing");
    if (pathname === "/") previewPlayedForDocument = true;
    const nextDark = !isDark;
    const newTheme = nextDark ? "dark" : "light";

    const apply = () => {
      if (nextDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme);
      window.dispatchEvent(new Event("storage"));
    };

    if (!document.startViewTransition || !buttonRef.current) {
      apply();
      return;
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radiusPx = Math.hypot(Math.max(x, vw - x), Math.max(y, vh - y));
    const at = ` at ${(x / vw * 100).toFixed(3)}% ${(y / vh * 100).toFixed(3)}%`;
    const radius = ((radiusPx / (Math.hypot(vw, vh) / Math.SQRT2)) * 100).toFixed(3);

    const vtStyle = document.createElement("style");
    vtStyle.textContent = "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal}";
    document.head.appendChild(vtStyle);

    const snapStyle = document.createElement("style");
    snapStyle.textContent = "*,*::before,*::after{transition-duration:0s!important}#theme-toggle .toggle-thumb{transition:transform 350ms cubic-bezier(0.2, 0, 0, 1)!important}";
    document.head.appendChild(snapStyle);

    const transition = document.startViewTransition(() => {
      apply();
    });

    transition.ready.then(() => {
      snapStyle.remove();
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0%${at})`,
            `circle(${radius}%${at})`
          ]
        },
        {
          duration: 600,
          easing: "cubic-bezier(0.2, 0, 0, 1)",
          pseudoElement: "::view-transition-new(root)"
        }
      );
    });

    transition.finished.finally(() => {
      vtStyle.remove();
    });
  };

  return (
    <button
      ref={buttonRef}
      id="theme-toggle"
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="min-h-[44px] min-w-[56px] flex items-center justify-center cursor-pointer select-none"
    >
      <span className="toggle-track" aria-hidden="true">
        {/* Sun indicator */}
        <span className="toggle-icon toggle-icon--sun toggle-dot" />
        {/* Moon indicator */}
        <span className="toggle-icon toggle-icon--moon toggle-dot" />
        {/* Arrow icon */}
        <svg
          className="toggle-icon toggle-icon--arrow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          fillRule="evenodd"
        >
          <path d="M13.688 4.88a1.58 1.58 0 0 0-1.04.829c-.095.203-.108.28-.108.631 0 .671-.046.609 1.842 2.501.89.892 1.618 1.634 1.618 1.65 0 .015-2.794.033-6.21.039l-6.21.01-.2.098a1.793 1.793 0 0 0-.723.711c-.107.212-.117.266-.117.651s.01.439.117.651c.139.273.445.575.723.711l.2.098 6.21.01c3.416.006 6.21.024 6.21.039 0 .016-.728.758-1.618 1.65-1.888 1.892-1.842 1.83-1.842 2.501 0 .351.013.428.108.631.35.746 1.265 1.064 2.024.703.27-.129 6.192-6.05 6.321-6.319.197-.414.197-.936.001-1.345-.069-.146-.78-.882-3.032-3.142-1.618-1.624-3.032-3.011-3.142-3.084a1.913 1.913 0 0 0-.334-.177 2.004 2.004 0 0 0-.798-.047" />
        </svg>
        {/* Sliding thumb */}
        <span className="toggle-thumb" />
      </span>
    </button>
  );
}
