"use client";

import React, { useState, useRef, useEffect } from "react";
import { CardItem } from "@/types/portfolio";

interface WorkCardProps {
  card: CardItem;
  entryIndex: number;
}

export function WorkCard({ card, entryIndex }: WorkCardProps) {
  const keepsLooping = card.id === "been-on" || card.id === "away";
  const startsOnLoad = Boolean(card.autoPlayVideo);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const isHoveredRef = useRef(false);
  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (shouldLoadVideo && startsOnLoad && videoRef.current) {
      const video = videoRef.current;
      if (keepsLooping) {
        video.play().then(() => setIsPlaying(true)).catch(() => {});
      } else {
        startTimeoutRef.current = setTimeout(() => {
          video.play().then(() => setIsPlaying(true)).catch(() => {});
        }, entryIndex * 800);
      }
    }
    return () => {
      if (startTimeoutRef.current) clearTimeout(startTimeoutRef.current);
    };
  }, [entryIndex, keepsLooping, shouldLoadVideo, startsOnLoad]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element || (!card.videoWebm && !card.videoMp4)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoadVideo(true);
        observer.disconnect();
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [card.videoMp4, card.videoWebm]);

  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const element = cardRef.current;

    if (!isDesktop || prefersReducedMotion || !element) {
      return;
    }

    element.classList.add("showcase-card--prepared");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.classList.add("showcase-card--visible");
        observer.disconnect();
      },
      { threshold: 0.12, rootMargin: "0px 0px -6%" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handleMouseEnter = () => {
    isHoveredRef.current = true;
    if (videoRef.current && (!startsOnLoad || !keepsLooping)) {
      const video = videoRef.current;
      // Let the first playback finish, then replay from the held final frame.
      if (startsOnLoad && !video.ended) return;
      video.currentTime = 0;
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    isHoveredRef.current = false;
    if (videoRef.current && !startsOnLoad) {
      videoRef.current.pause();
      if (!startsOnLoad) setIsPlaying(false);
    }
  };

  const handleVideoEnded = () => {
    if (!startsOnLoad || keepsLooping || !videoRef.current) return;
    const video = videoRef.current;
    video.pause();
    // Keep the video's final frame visible until the next hover.
    setIsPlaying(true);
  };

  // Prepend / if needed
  const normalizePath = (p?: string | null) => {
    if (!p) return undefined;
    if (p.startsWith("http") || p.startsWith("/")) return p;
    return `/${p}`;
  };

  const imgSrc = normalizePath(card.imgSrc);
  const videoWebm = normalizePath(card.videoWebm);
  const videoMp4 = normalizePath(card.videoMp4);

  return (
    <div
      ref={cardRef}
      className="group-wrap showcase-card w-full mb-8 md:mb-6 lg:mb-7"
      data-type={card.type}
      data-in-all={card.inAll ? "true" : "false"}
      style={{ "--showcase-entry-delay": `${Math.min(entryIndex, 8) * 45}ms` } as React.CSSProperties}
    >
      <a
        href={card.href}
        target={card.isExternal ? "_blank" : undefined}
        rel={card.isExternal ? "noopener noreferrer" : undefined}
        className="card-root group relative block overflow-hidden border border-[var(--c-border)] dark:border-[var(--c-dark-border)] bg-[var(--c-bg)] dark:bg-[var(--c-dark-bg)] shadow-sm hover:shadow-md"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`card-img-wrap relative w-full overflow-hidden loaded ${shouldLoadVideo && isPlaying ? "video-playing" : ""}`}
          style={{ aspectRatio: card.aspectRatio || "4 / 3" }}
        >
          {/* Main Image */}
          {imgSrc && (
            <img
              src={imgSrc}
              alt={card.imgAlt || card.title}
              loading="eager"
              className={`card-img ${startsOnLoad && !keepsLooping && !isPlaying ? "card-video-poster" : ""}`}
              style={card.objectPosition ? ({ "--card-object-position": card.objectPosition } as React.CSSProperties) : undefined}
            />
          )}

          {/* Video (if snippets or video projects) */}
          {shouldLoadVideo && (videoWebm || videoMp4) && (
            <video
              ref={videoRef}
              autoPlay={keepsLooping && startsOnLoad}
              muted
              loop={!startsOnLoad || keepsLooping}
              playsInline
              preload="metadata"
              onEnded={handleVideoEnded}
              className="card-video"
            >
              {videoWebm && <source src={videoWebm} type="video/webm" />}
              {videoMp4 && <source src={videoMp4} type="video/mp4" />}
            </video>
          )}

          {/* Timed HTML Overlay on Hover (fades in at flip completion) */}
          {card.hoverOverlay && (
            <div className="card-hover-overlay" aria-hidden="true">
              <div className="card-hover-card">
                {card.hoverOverlay.badge && (
                  <div className="card-hover-badge">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
                    <span>{card.hoverOverlay.badge}</span>
                  </div>
                )}
                {card.hoverOverlay.title && (
                  <div className="card-hover-title">
                    {card.hoverOverlay.title}
                  </div>
                )}
                {card.hoverOverlay.subtitle && (
                  <div className="card-hover-subtitle">
                    {card.hoverOverlay.subtitle}
                  </div>
                )}
              </div>
            </div>
          )}

          {!imgSrc && !videoWebm && !videoMp4 && (
            <div className="card-placeholder" aria-hidden="true">
              <span>{card.title}</span>
              <span>{card.year}</span>
            </div>
          )}

          {/* Desktop Hover Action Button */}
          <div className="card-btn-zone">
            <div className="card-hover-btn">
              <span>{card.title}</span>
              <span className="flex items-center">
                <svg
                  className="w-4 h-4 ml-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </a>

      {/* Mobile Caption Bar */}
      <div className="card-caption">
        <span className="card-caption-title font-medium text-[var(--c-text)] dark:text-[var(--c-dark-text)]">
          {card.title}
        </span>
      </div>
    </div>
  );
}
