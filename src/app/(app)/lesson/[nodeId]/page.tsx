import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { getLessonSession } from "@/lib/data/lessons";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}): Promise<Metadata> {
  const { nodeId } = await params;
  const session = getLessonSession(nodeId);
  return { title: session?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}) {
  const { nodeId } = await params;
  const session = getLessonSession(nodeId);
  if (!session) notFound();

  return <LessonPlayer session={session} />;
}
