import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PROJECTS_DATA } from "@/data/pagesContent";
import { DetailLayout } from "@/components/site/DetailLayout";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(PROJECTS_DATA).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA[slug];

  if (!project) {
    return {
      title: "Project · Giovanni De Gattis",
    };
  }

  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA[slug];

  if (!project) {
    notFound();
  }

  return (
    <DetailLayout
      backHref="/#work"
      backLabel="Work"
      liveUrl={project.liveUrl}
      liveFaviconUrl={project.liveFaviconUrl}
      liveLinkNote={project.liveLinkNote}
      figmaUrl={project.figmaUrl}
      actionLinks={project.actionLinks}
      logoImage={project.logoImage}
      logoAlt={project.logoAlt}
      secondaryImage={project.secondaryImage}
      secondaryImageAlt={project.secondaryImageAlt}
      bodyHtml={project.bodyHtml}
    />
  );
}
