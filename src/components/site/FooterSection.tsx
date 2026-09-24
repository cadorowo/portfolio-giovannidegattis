"use client";

import React from "react";
import { ArrowUp, Mail, FileText } from "lucide-react";

export function FooterSection() {
  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="site-footer-frame mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-[100px]">
      <div className="site-footer-tagline flex items-end justify-between gap-4 mb-4 text-[0.8125rem] text-[var(--c-muted)] dark:text-[var(--c-dark-muted)]">
        <span className="hidden sm:inline whitespace-nowrap">turin - lisboa</span>

        <span className="hidden sm:inline whitespace-nowrap">Selected work &amp; digital craft</span>
      </div>

      <footer className="site-footer">
        <div className="site-footer-content">
          <ul className="site-footer-socials">
            <li>
              <a
                href="/Giovanni_De_Gattis_CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="social-text-link"
              >
                <FileText aria-hidden="true" size={18} strokeWidth={1.8} />
                CV
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/giovanni-de-gattis/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-text-link"
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124ZM6.913 20.452H3.76V9h3.153v11.452Z" />
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href="https://github.com/cadorowo"
                target="_blank"
                rel="noopener noreferrer"
                className="social-text-link"
              >
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 .297a12 12 0 0 0-3.793 23.386c.6.111.82-.261.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.605-2.665-.303-5.466-1.333-5.466-5.932 0-1.311.469-2.381 1.237-3.221-.124-.303-.536-1.523.118-3.176 0 0 1.008-.323 3.301 1.23a11.524 11.524 0 0 1 6.007 0c2.291-1.553 3.297-1.23 3.297-1.23.656 1.653.244 2.873.12 3.176.771.84 1.235 1.91 1.235 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.216.694.825.576A12.001 12.001 0 0 0 12 .297Z" />
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.behance.net/cadorogio?tracking_source=search_users|giovanni%20de%20gattis"
                target="_blank"
                rel="noopener noreferrer"
                className="social-text-link"
              >
                <span className="site-footer-behance" aria-hidden="true">Bē</span>
                Behance
              </a>
            </li>
            <li>
              <a
                href="mailto:giovannidegattis@gmail.com"
                className="social-text-link"
              >
                <Mail aria-hidden="true" size={18} strokeWidth={1.8} />
                Email
              </a>
            </li>
            <li>
              <a
                href="#"
                onClick={scrollToTop}
                className="social-text-link cursor-pointer"
              >
                <ArrowUp aria-hidden="true" size={18} strokeWidth={1.8} />
                Back to top
              </a>
            </li>
          </ul>
        </div>

        <p className="site-footer-mark">Giovanni De Gattis</p>
      </footer>
    </div>
  );
}
