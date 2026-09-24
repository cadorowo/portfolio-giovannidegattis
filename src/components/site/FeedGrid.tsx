"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { CardItem, FilterValue } from "@/types/portfolio";
import { WorkCard } from "./WorkCard";

interface FeedGridProps {
  cards: CardItem[];
  filter: FilterValue;
  view: "grid" | "list";
}

export function FeedGrid({ cards, filter, view }: FeedGridProps) {
  const [revealedCount, setRevealedCount] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Filter cards based on selected filter
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      if (filter === "all") return card.inAll;
      return Array.isArray(card.category)
        ? card.category.includes(filter)
        : card.category === filter;
    });
  }, [cards, filter]);

  // Observer for sentinel
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setRevealedCount((prev) => Math.min(prev + 6, filteredCards.length));
        }
      },
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [filteredCards.length]);

  const visibleCards = useMemo(() => {
    return filteredCards.slice(0, revealedCount);
  }, [filteredCards, revealedCount]);

  const showcaseEntryIndex = useMemo(
    () => new Map(visibleCards.map((card, index) => [card.id, index])),
    [visibleCards]
  );

  // Helper to parse aspect ratio to number
  const getAspectRatio = (ratioStr?: string): number => {
    if (!ratioStr) return 4 / 3;
    const parts = ratioStr.split("/").map((p) => parseFloat(p.trim()));
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && parts[1] > 0) {
      return parts[0] / parts[1];
    }
    return 4 / 3;
  };

  // Height-balanced masonry split across 3 columns for dynamic interlocking
  const { col1, col2, col3 } = useMemo(() => {
    const c1: CardItem[] = [];
    const c2: CardItem[] = [];
    const c3: CardItem[] = [];
    let h1 = 0;
    let h2 = 0;
    let h3 = 0;

    for (const card of visibleCards) {
      const ratio = getAspectRatio(card.aspectRatio);
      const cardHeight = 1 / ratio + 0.08;

      if (h1 <= h2 && h1 <= h3) {
        c1.push(card);
        h1 += cardHeight;
      } else if (h2 <= h1 && h2 <= h3) {
        c2.push(card);
        h2 += cardHeight;
      } else {
        c3.push(card);
        h3 += cardHeight;
      }
    }

    return { col1: c1, col2: c2, col3: c3 };
  }, [visibleCards]);

  return (
    <div id="work" className="pb-32 sm:pb-40">
      {view === "list" && (
        <div className="project-list">
          {visibleCards.map((card) => (
            <a key={card.id} href={card.href} target={card.isExternal ? "_blank" : undefined} rel={card.isExternal ? "noopener noreferrer" : undefined} className="project-list__item">
              <div className="project-list__image">{(card.listImgSrc || (card.type === "project" ? `/images/projects/${card.id}/logo.png` : card.imgSrc)) ? <img src={card.listImgSrc || (card.type === "project" ? `/images/projects/${card.id}/logo.png` : card.imgSrc || "")} alt="" /> : <span>{card.title.slice(0, 1)}</span>}</div>
              <div><h3>{card.title}</h3><p>{card.tag}{card.year ? ` · ${card.year}` : ""}</p></div>
              <span className="project-list__arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>
      )}
      {view === "grid" && <>
      {/* Mobile single-column stream in natural order */}
      <div className="flex flex-col md:hidden">
        {visibleCards.map((card) => (
          <WorkCard key={card.id} card={card} entryIndex={showcaseEntryIndex.get(card.id) ?? 0} />
        ))}
      </div>

      {/* 3-column dynamic height-balanced masonry grid */}
      <div id="feed-grid" className="hidden md:grid md:grid-cols-3 gap-x-6 lg:gap-x-7 items-start">
        {/* Column 1 */}
        <div className="flex flex-col">
          {col1.map((card) => (
            <WorkCard key={card.id} card={card} entryIndex={showcaseEntryIndex.get(card.id) ?? 0} />
          ))}
        </div>

        {/* Column 2 */}
        <div className="flex flex-col">
          {col2.map((card) => (
            <WorkCard key={card.id} card={card} entryIndex={showcaseEntryIndex.get(card.id) ?? 0} />
          ))}
        </div>

        {/* Column 3 */}
        <div className="flex flex-col">
          {col3.map((card) => (
            <WorkCard key={card.id} card={card} entryIndex={showcaseEntryIndex.get(card.id) ?? 0} />
          ))}
        </div>
      </div>
      </>}

      {/* Sentinel */}
      {revealedCount < filteredCards.length && (
        <div ref={sentinelRef} id="feed-sentinel" className="h-10 w-full" />
      )}
    </div>
  );
}
