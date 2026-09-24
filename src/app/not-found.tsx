import Link from "next/link";
import { FooterSection } from "@/components/site/FooterSection";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--c-page-bg)] text-[var(--c-text)] dark:text-[var(--c-dark-text)] transition-colors duration-300">
      <main className="mx-auto max-w-[1440px] px-6 sm:px-10 mt-16 sm:mt-10 lg:px-[100px] lg:mt-[100px]">
        <div className="flex flex-col gap-20 sm:gap-32">
          <section className="flex flex-col items-center justify-center text-center min-h-[60vh] gap-4">
            <h1 className="text-8xl font-medium text-[var(--c-accent-ink)]">
              404
            </h1>
            <p className="text-base text-[var(--c-muted)] dark:text-[var(--c-dark-muted)] max-w-[32ch]">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className="mt-4 text-sm font-medium text-[var(--c-accent-ink)] hover:opacity-80 transition-opacity"
            >
              Back to home
            </Link>
          </section>
        </div>
      </main>

      <FooterSection />
    </div>
  );
}
