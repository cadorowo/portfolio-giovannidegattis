"use client";

import React, { useEffect, useRef, useCallback } from "react";
import { FilterValue } from "@/types/portfolio";

interface FilterBarProps {
  currentFilter: FilterValue;
  onFilterChange: (filter: FilterValue) => void;
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function FilterBar({ currentFilter, onFilterChange, view, onViewChange }: FilterBarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<HTMLSpanElement>(null);

  const filters: { label: string; value: FilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Design", value: "design" },
    { label: "Digital & Systems", value: "systems" },
  ];

  const updateUnderline = useCallback(() => {
    if (!containerRef.current || !underlineRef.current) return;
    const activeBtn = containerRef.current.querySelector(
      `[data-filter-value="${currentFilter}"]`
    ) as HTMLElement;
    if (!activeBtn) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const left = btnRect.left - containerRect.left;
    const width = btnRect.width;

    underlineRef.current.style.transform = `translateX(${left}px)`;
    underlineRef.current.style.width = `${width}px`;
  }, [currentFilter]);

  useEffect(() => {
    updateUnderline();
    window.addEventListener("resize", updateUnderline);
    return () => window.removeEventListener("resize", updateUnderline);
  }, [updateUnderline]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-32 sm:mt-40 mb-8 sm:mb-12">
      <div
        ref={containerRef}
        data-feed-filter
        className="relative flex items-center gap-8 max-w-full"
      >
        <span ref={underlineRef} className="feed-filter-underline" />

        {filters.map((f) => {
          const isActive = currentFilter === f.value;
          return (
            <button
              key={f.value}
              data-filter-value={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`feed-filter-btn whitespace-nowrap ${isActive ? "is-active" : ""}`}
            >
              {f.label}
            </button>
          );
        })}
      </div>
      <div className="view-switch" aria-label="Project view">
        <button type="button" className={view === "grid" ? "is-active" : ""} onClick={() => onViewChange("grid")} aria-label="Grid view"><span className="view-icon view-icon--grid" aria-hidden="true" /></button>
        <button type="button" className={view === "list" ? "is-active" : ""} onClick={() => onViewChange("list")} aria-label="List view"><span className="view-icon view-icon--list" aria-hidden="true" /></button>
      </div>
    </div>
  );
}
