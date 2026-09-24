"use client";

import React, { useState } from "react";
import { IntroSection } from "@/components/site/IntroSection";
import { FilterBar } from "@/components/site/FilterBar";
import { FeedGrid } from "@/components/site/FeedGrid";
import { FooterSection } from "@/components/site/FooterSection";
import { PORTFOLIO_CARDS } from "@/data/cards";
import { FilterValue } from "@/types/portfolio";

export default function Home() {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [view, setView] = useState<"grid" | "list">("grid");

  return (
    <main className="min-h-screen bg-[var(--c-page-bg)] text-[var(--c-text)] dark:text-[var(--c-dark-text)] transition-colors duration-300">
      <div className="mx-auto max-w-[1440px] px-6 pt-24 sm:px-10 sm:pt-32 lg:px-[100px]">
        <IntroSection />
        <FilterBar currentFilter={filter} onFilterChange={setFilter} view={view} onViewChange={setView} />
        <FeedGrid key={`${filter}-${view}`} cards={PORTFOLIO_CARDS} filter={filter} view={view} />
      </div>

      <FooterSection />
    </main>
  );
}
