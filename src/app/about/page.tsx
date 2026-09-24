import { Metadata } from "next";
import { ABOUT_DATA } from "@/data/pagesContent";
import { DetailLayout } from "@/components/site/DetailLayout";

export const metadata: Metadata = {
  title: ABOUT_DATA.title,
  description: ABOUT_DATA.description,
};

export default function AboutPage() {
  return (
    <DetailLayout
      backHref="/"
      backLabel="Home"
      actionLinks={ABOUT_DATA.actionLinks}
      bodyHtml={ABOUT_DATA.bodyHtml}
    />
  );
}
