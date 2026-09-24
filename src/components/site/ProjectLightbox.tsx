"use client";

import { useEffect, useRef, type Dispatch, type KeyboardEvent as ReactKeyboardEvent, type SetStateAction } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ProjectLightboxProps {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onIndexChange: Dispatch<SetStateAction<number>>;
}

export function ProjectLightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: ProjectLightboxProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const activeImage = images[index];

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (images.length < 2) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        onIndexChange((current) => (current - 1 + images.length) % images.length);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        onIndexChange((current) => (current + 1) % images.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) {
        window.requestAnimationFrame(() => previousFocus.focus());
      }
    };
  }, [images.length, onClose, onIndexChange]);

  const trapFocus = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      "button:not(:disabled)"
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const goTo = (direction: -1 | 1) => {
    onIndexChange((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div
      className="project-lightbox"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        ref={dialogRef}
        className="project-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Project image viewer"
        onKeyDown={trapFocus}
      >
        <header className="project-lightbox-header">
          <span className="project-lightbox-count" aria-live="polite">
            {index + 1} <span aria-hidden="true">/</span> {images.length}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            className="project-lightbox-close"
            aria-label="Close image viewer"
            onClick={onClose}
          >
            <X size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </header>

        <div
          className="project-lightbox-stage"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          {images.length > 1 && (
            <button
              type="button"
              className="project-lightbox-nav project-lightbox-nav--previous"
              aria-label="Previous image"
              onClick={() => goTo(-1)}
            >
              <ChevronLeft size={22} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}

          {activeImage && (
            <img
              className="project-lightbox-image"
              src={activeImage.src}
              alt={activeImage.alt}
              draggable={false}
            />
          )}

          {images.length > 1 && (
            <button
              type="button"
              className="project-lightbox-nav project-lightbox-nav--next"
              aria-label="Next image"
              onClick={() => goTo(1)}
            >
              <ChevronRight size={22} strokeWidth={1.8} aria-hidden="true" />
            </button>
          )}
        </div>

        <footer className="project-lightbox-footer">
          <p>{activeImage?.alt}</p>
          {images.length > 1 && <span>Use ← → to navigate</span>}
        </footer>
      </section>
    </div>
  );
}
