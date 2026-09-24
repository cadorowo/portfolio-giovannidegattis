import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { SNIPPET_SLUGS } from "@/data/pagesContent";

export async function generateStaticParams() {
  return SNIPPET_SLUGS.map((slug) => ({
    slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const snippetPath = path.join(
    process.cwd(),
    "public",
    "snippets-cache",
    `${slug}.html`
  );

  if (!fs.existsSync(snippetPath)) {
    notFound();
  }

  const html = fs.readFileSync(snippetPath, "utf8");

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
