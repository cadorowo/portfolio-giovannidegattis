"use client";

import React from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ActivityCalendar } from "react-activity-calendar";

function subscribeToTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getThemeSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerThemeSnapshot(): "light" {
  return "light";
}

function GitHubContributionGraph() {
  const [data, setData] = React.useState<Array<{ date: string; count: number; level: number }>>([]);
  const [total, setTotal] = React.useState<number | null>(null);
  const colorScheme = React.useSyncExternalStore(subscribeToTheme, getThemeSnapshot, getServerThemeSnapshot);

  React.useEffect(() => {
    fetch("/api/github-contributions")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => { if (payload) { setData(payload.days); setTotal(payload.total); } })
      .catch(() => undefined);
  }, []);

  return (
    <div className="github-graph" aria-label="GitHub contribution activity">
      <ActivityCalendar
        data={data}
        loading={!data.length}
        blockSize={6}
        blockMargin={1}
        blockRadius={1.5}
        fontSize={11}
        showWeekdayLabels={false}
        showColorLegend={false}
        colorScheme={colorScheme}
        theme={{ light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"], dark: ["#1b1f23", "#0e4429", "#006d32", "#26a641", "#39d353"] }}
        labels={{ totalCount: `${total ?? 0} contributions in the last year` }}
      />
    </div>
  );
}

export function IntroSection() {
  return (
    <section className="max-w-[420px] mx-auto flex flex-col gap-1">
      <div className="flex items-start justify-between">
        <div className="flex flex-col">
          <h1 className="text-base font-display font-medium leading-snug text-[var(--c-accent-ink)]">
            Hi, I&apos;m Giovanni De Gattis
          </h1>
          <span className="text-base leading-snug text-[var(--c-muted)] dark:text-[var(--c-dark-muted)]">
            Designing visual identities and digital products, building the systems behind them
          </span>
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>

      <p className="text-base text-[var(--c-muted)] dark:text-[var(--c-dark-muted)] mt-14 leading-relaxed">
        Studying Communication Design @{" "}
        <a
          href="https://www.polito.it"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-link"
        >
          Politecnico di Torino
        </a>
        <br />
      </p>

      <p className="bio-copy text-base text-[var(--c-muted)] dark:text-[var(--c-dark-muted)] mt-4 leading-relaxed">
        I create visual identities and digital products, then build the systems that bring them to life.
        <br />
        This portfolio focuses on design work; for code, video workflows and technical experiments, explore my{" "}
        <a
          href="https://github.com/cadorowo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-link"
        >
          GitHub
        </a>
        .
      </p>

      <GitHubContributionGraph />

      <p className="hero-links mt-14 text-base leading-relaxed flex flex-col gap-1 items-start">
        <a
          href="/about"
          className="social-text-link"
        >
          <span className="social-icon social-icon--asterisk inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <path
                d="M11.673 3.063c-.261.08-.533.358-.612.627-.052.176-.061.654-.061 3.382 0 2.716-.008 3.173-.056 3.155-.031-.012-1.224-.696-2.65-1.519a260.975 260.975 0 0 0-2.767-1.585.98.98 0 0 0-1.35.459c-.093.191-.105.255-.087.476.024.3.145.544.35.705.077.06 1.35.807 2.83 1.661 1.48.853 2.69 1.562 2.69 1.576 0 .014-1.21.723-2.69 1.576-1.48.853-2.753 1.601-2.83 1.661-.205.161-.326.405-.35.705-.018.221-.006.285.087.476a.98.98 0 0 0 1.35.459c.095-.048 1.34-.762 2.767-1.585a244.163 244.163 0 0 1 2.65-1.519c.048-.018.056.442.056 3.176 0 3.61-.015 3.43.306 3.751.18.179.458.3.694.3.237 0 .514-.12.697-.303.315-.316.303-.164.303-3.769 0-2.716.008-3.173.056-3.155.031.012 1.224.696 2.65 1.519 1.427.824 2.672 1.537 2.767 1.585a.983.983 0 0 0 1.316-.388c.095-.161.111-.233.111-.489 0-.348-.102-.576-.34-.763-.077-.06-1.351-.808-2.831-1.661-1.48-.854-2.686-1.566-2.68-1.583.006-.017 1.217-.726 2.691-1.576 1.474-.849 2.743-1.594 2.82-1.654.238-.187.34-.415.34-.763 0-.256-.016-.328-.111-.489a.983.983 0 0 0-1.316-.388c-.095.048-1.34.761-2.767 1.585a265.657 265.657 0 0 1-2.65 1.519c-.048.018-.056-.439-.056-3.155 0-3.605.012-3.453-.303-3.769-.279-.279-.63-.361-1.024-.24"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </span>
          <span>learn a little bit about me</span>
        </a>

        <a
          href="/Giovanni_De_Gattis_CV.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="social-text-link"
        >
          <span className="social-icon social-icon--cv inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </span>
          <span>curriculum vitae (cv)</span>
        </a>

        <a
          href="https://www.linkedin.com/in/giovanni-de-gattis/"
          target="_blank"
          rel="noopener noreferrer"
          className="social-text-link"
        >
          <span className="social-icon social-icon--linkedin inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <path d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5563 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2938 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516V20.4516Z" />
            </svg>
          </span>
          <span>linkedin.com/in/giovanni-de-gattis</span>
        </a>

        <a
          href="https://github.com/cadorowo"
          target="_blank"
          rel="noopener noreferrer"
          className="social-text-link"
        >
          <span className="social-icon social-icon--github inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.3724 0 0 5.3808 0 12.0204C0 17.3304 3.438 21.8364 8.2068 23.4252C8.8068 23.5356 9.0252 23.1648 9.0252 22.8456C9.0252 22.5612 9.0156 21.804 9.0096 20.802C5.6712 21.528 4.9668 19.1904 4.9668 19.1904C4.422 17.8008 3.6348 17.4312 3.6348 17.4312C2.5452 16.6872 3.7176 16.7016 3.7176 16.7016C4.9212 16.7856 5.5548 17.94 5.5548 17.94C6.6252 19.776 8.364 19.2456 9.0468 18.9384C9.1572 18.162 9.4668 17.6328 9.81 17.3328C7.146 17.0292 4.344 15.9972 4.344 11.3916C4.344 10.08 4.812 9.006 5.5788 8.166C5.4552 7.8624 5.0436 6.6396 5.6964 4.986C5.6964 4.986 6.7044 4.662 8.9964 6.2172C9.97532 5.95022 10.9853 5.81423 12 5.8128C13.02 5.8176 14.046 5.9508 15.0048 6.2172C17.2956 4.662 18.3012 4.9848 18.3012 4.9848C18.9564 6.6396 18.5436 7.8624 18.4212 8.166C19.1892 9.006 19.6548 10.08 19.6548 11.3916C19.6548 16.0092 16.848 17.0256 14.1756 17.3232C14.6064 17.694 14.9892 18.4272 14.9892 19.5492C14.9892 21.1548 14.9748 22.452 14.9748 22.8456C14.9748 23.1672 15.1908 23.5416 15.8004 23.424C18.19 22.6225 20.2672 21.0904 21.7386 19.0441C23.2099 16.9977 24.001 14.5408 24 12.0204C24 5.3808 18.6264 0 12 0Z" />
            </svg>
          </span>
          <span>github.com/cadorowo</span>
        </a>

        <a
          href="https://www.behance.net/cadorogio?tracking_source=search_users|giovanni%20de%20gattis"
          target="_blank"
          rel="noopener noreferrer"
          className="social-text-link"
        >
          <span className="social-icon social-icon--behance inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <path d="M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-4.049 0-5.748-2.671-5.748-5.753 0-3.668 2.378-5.835 5.567-5.835 3.328 0 5.161 2.083 5.161 5.485 0 .426-.037.915-.074 1.258h-7.616c.037 1.839 1.206 2.768 2.738 2.768 1.458 0 2.219-.741 2.589-1.423l2.484.5zm-5.176-4.526c-.037-1.285-.808-2.228-2.458-2.228-1.503 0-2.316.923-2.5 2.228h4.958zm-11.55 7.526h-7v-16h7.526c3.224 0 5.474 1.637 5.474 4.542 0 1.688-.868 3.109-2.348 3.791 1.815.603 2.923 2.193 2.923 4.215 0 3.309-2.583 4.452-6.575 4.452zm-4-9h3.407c1.334 0 2.454-.538 2.454-1.99 0-1.285-.947-1.89-2.253-1.89h-3.608v3.88zm0 6h3.693c1.554 0 2.769-.646 2.769-2.223 0-1.472-1.129-2.127-2.675-2.127h-3.787v4.35z" />
            </svg>
          </span>
          <span>behance.net/cadorogio</span>
        </a>

        <a
          href="mailto:giovannidegattis@gmail.com"
          className="social-text-link"
        >
          <span className="social-icon social-icon--mail inline-flex items-center justify-center w-4 h-4 shrink-0 text-current" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 block">
              <rect width="20" height="16" x="2" y="4" rx="2" />
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
            </svg>
          </span>
          <span>giovannidegattis@gmail.com</span>
        </a>
      </p>
    </section>
  );
}
