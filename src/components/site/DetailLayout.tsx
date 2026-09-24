"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { FooterSection } from "./FooterSection";
import { ProjectLightbox, type LightboxImage } from "./ProjectLightbox";

export interface ActionLink {
  label: string;
  href: string;
  type?: "site" | "figma" | "default";
  faviconUrl?: string;
}

interface DetailLayoutProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  liveUrl?: string;
  liveFaviconUrl?: string;
  liveLinkNote?: string;
  figmaUrl?: string;
  actionLinks?: ActionLink[];
  logoImage?: string;
  logoAlt?: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
  bodyHtml: string;
}

function getProcessedBodyHtml(
  html: string,
  liveUrl?: string,
  liveFaviconUrl?: string,
  liveLinkNote?: string,
  figmaUrl?: string,
  actionLinks?: ActionLink[]
) {
  const links: ActionLink[] = [];

  if (actionLinks && actionLinks.length > 0) {
    links.push(...actionLinks);
  } else {
    if (liveUrl) {
      links.push({ label: "Live Website", href: liveUrl, type: "site", faviconUrl: liveFaviconUrl });
    }
    if (figmaUrl) {
      links.push({ label: "Figma Prototype", href: figmaUrl, type: "figma" });
    }
  }

  if (links.length === 0) return html;

  const actionsHtml = `
    <div class="project-actions">
      ${links
        .map(
          (link) => {
            const type = link.type || (link.href.includes("figma.com") ? "figma" : "site");
            const favicon =
              type === "site"
                ? `<span class="project-action-favicon-wrap" aria-hidden="true"><img class="project-action-favicon" width="14" height="14" src="${link.faviconUrl || new URL("/favicon.ico", link.href).href}" alt="" onerror="this.parentElement?.classList.add('is-unavailable')"></span>`
                : "";

            return `
        <a href="${link.href}" target="_blank" rel="noopener noreferrer" class="project-action-btn project-action-btn--${link.type || (link.href.includes("figma.com") ? "figma" : "site")}">
          ${favicon}
          <span>${link.label}</span>
          <span class="project-action-arrow" aria-hidden="true">↗</span>
        </a>
      `;
          }
        )
        .join('<span class="project-actions-separator">·</span>')}
      ${liveLinkNote ? `<span class="project-action-note">${liveLinkNote}</span>` : ""}
    </div>
  `;

  // Inject inside the project-title-block (before its closing </div>)
  const titleBlockIndex = html.indexOf('class="project-title-block"');
  if (titleBlockIndex !== -1) {
    const closingDivIndex = html.indexOf("</div>", titleBlockIndex);
    if (closingDivIndex !== -1) {
      return (
        html.slice(0, closingDivIndex) +
        actionsHtml +
        html.slice(closingDivIndex)
      );
    }
  }

  const articleIndex = html.indexOf("<article");
  if (articleIndex !== -1) {
    const lastDivBeforeArticle = html.lastIndexOf("</div>", articleIndex);
    if (lastDivBeforeArticle !== -1) {
      return (
        html.slice(0, lastDivBeforeArticle) +
        actionsHtml +
        html.slice(lastDivBeforeArticle)
      );
    }
  }

  return actionsHtml + html;
}

export function DetailLayout({
  backHref = "/",
  backLabel = "Back",
  liveUrl,
  liveFaviconUrl,
  liveLinkNote,
  figmaUrl,
  actionLinks,
  logoImage,
  logoAlt,
  secondaryImage,
  secondaryImageAlt,
  bodyHtml,
}: DetailLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const [lightboxImages, setLightboxImages] = useState<LightboxImage[] | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const closeLightbox = useCallback(() => setLightboxImages(null), []);
  const secondaryHtml = secondaryImage
    ? `<div class="project-img-wrap" style="aspect-ratio: 4 / 3"><img src="${secondaryImage}" alt="${secondaryImageAlt || "Project supporting image"}" class="project-img" loading="eager"></div>`
    : "";
  let finalHtml = getProcessedBodyHtml(bodyHtml, liveUrl, liveFaviconUrl, liveLinkNote, figmaUrl, actionLinks);
  if (logoImage) {
    finalHtml = finalHtml.replace(
      /(<div[^>]*class="[^"]*project-poster[^"]*"[\s\S]*?<img[^>]*src=")[^"]+("[^>]*>)/,
      `$1${logoImage}$2`
    );
  }
  if (logoAlt) {
    finalHtml = finalHtml.replace(
      /(<div[^>]*class="[^"]*project-poster[^"]*"[\s\S]*?<img[^>]*alt=")[^"]*("[^>]*>)/,
      `$1${logoAlt}$2`
    );
  }

  finalHtml = finalHtml.replace(/(<article[^>]*class="project-body"[^>]*>)/, `${secondaryHtml}$1`);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const imageWrappers = Array.from(
      root.querySelectorAll<HTMLElement>(".project-poster, .project-body .project-img-wrap")
    );
    const galleryEntries = imageWrappers.flatMap((wrapper) => {
      const image = wrapper.querySelector<HTMLImageElement>('img:not([aria-hidden="true"])');
      return image ? [{ wrapper, image }] : [];
    });
    const gallery: LightboxImage[] = galleryEntries.map(({ image }) => ({
      src: image.currentSrc || image.src,
      alt: image.alt,
    }));
    const restoreAttributes: Array<() => void> = [];

    galleryEntries.forEach(({ wrapper, image }, index) => {
      const previousRole = wrapper.getAttribute("role");
      const previousTabIndex = wrapper.getAttribute("tabindex");
      const previousHasPopup = wrapper.getAttribute("aria-haspopup");
      const previousLabel = wrapper.getAttribute("aria-label");

      wrapper.setAttribute("role", "button");
      wrapper.setAttribute("tabindex", "0");
      wrapper.setAttribute("aria-haspopup", "dialog");
      wrapper.setAttribute(
        "aria-label",
        image.alt ? `Open image: ${image.alt}` : `Open image ${index + 1}`
      );

      const open = () => {
        previouslyFocusedRef.current = wrapper;
        setLightboxIndex(index);
        setLightboxImages(gallery);
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      };

      wrapper.addEventListener("click", open);
      wrapper.addEventListener("keydown", onKeyDown);
      restoreAttributes.push(() => {
        wrapper.removeEventListener("click", open);
        wrapper.removeEventListener("keydown", onKeyDown);
        if (previousRole === null) wrapper.removeAttribute("role");
        else wrapper.setAttribute("role", previousRole);
        if (previousTabIndex === null) wrapper.removeAttribute("tabindex");
        else wrapper.setAttribute("tabindex", previousTabIndex);
        if (previousHasPopup === null) wrapper.removeAttribute("aria-haspopup");
        else wrapper.setAttribute("aria-haspopup", previousHasPopup);
        if (previousLabel === null) wrapper.removeAttribute("aria-label");
        else wrapper.setAttribute("aria-label", previousLabel);
      });
    });

    // Handle blur-up image transitions
    const imgWraps = root.querySelectorAll(
      ".blur-img-wrap, .project-img-wrap"
    );

    imgWraps.forEach((wrap) => {
      const img = wrap.querySelector("img.blur-img, img.project-img") as HTMLImageElement | null;
      if (!img) return;

      if (img.complete && img.naturalWidth > 0) {
        wrap.classList.add("loaded");
      } else {
        img.addEventListener("load", () => wrap.classList.add("loaded"), { once: true });
      }
    });

    // Handle video autoplay
    const videos = root.querySelectorAll("video");
    videos.forEach((video) => {
      video.play().catch(() => {});
    });

    return () => restoreAttributes.forEach((restore) => restore());
  }, [finalHtml]);

  return (
    <div className="min-h-screen bg-[var(--c-page-bg)] text-[var(--c-text)] dark:text-[var(--c-dark-text)] transition-colors duration-300">
      <main className="mx-auto max-w-[1440px] px-6 sm:px-10 mt-16 sm:mt-10 lg:px-[100px] lg:mt-[100px]">
        <div className="flex flex-col gap-20 sm:gap-32">
          <section
            id="project-detail"
            className="w-full max-w-[420px] min-w-0 mx-auto flex flex-col gap-10 sm:gap-12"
          >
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between">
              <Link
                href={backHref}
                data-back-link
                className="back-link inline-flex items-center gap-1.5 text-sm text-[var(--c-muted)] dark:text-[var(--c-dark-muted)] hover:text-[var(--c-accent-ink)] no-underline"
              >
                <span className="back-arrow" aria-hidden="true">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                  >
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {backLabel}
              </Link>
              <ThemeToggle />
            </div>

            {/* Page Body Content */}
            <div
              ref={containerRef}
              className="project-body-content min-w-0 flex flex-col"
              dangerouslySetInnerHTML={{ __html: finalHtml }}
            />
          </section>
        </div>
      </main>

      <FooterSection />
      {lightboxImages && (
        <ProjectLightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={closeLightbox}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}
