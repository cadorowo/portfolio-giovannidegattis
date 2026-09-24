import { Metadata } from "next";
import { FOREST_DATA } from "@/data/pagesContent";
import { DetailLayout } from "@/components/site/DetailLayout";

export const metadata: Metadata = {
  title: FOREST_DATA.title,
  description: FOREST_DATA.description,
};

export default function ForestPage() {
  return (
    <DetailLayout
      backHref="/"
      backLabel="Home"
      bodyHtml={FOREST_DATA.bodyHtml}
    />
  );
}
