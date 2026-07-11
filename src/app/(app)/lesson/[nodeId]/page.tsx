import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { BossPlayer } from "@/components/lesson/boss-player";
import { getLessonSession } from "@/lib/data/lessons";
import { getBossBattle } from "@/lib/data/boss";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}): Promise<Metadata> {
  const { nodeId } = await params;
  const boss = getBossBattle(nodeId);
  if (boss) return { title: `Boss Battle: ${boss.name}` };
  const session = getLessonSession(nodeId);
  return { title: session?.title ?? "Lesson" };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ nodeId: string }>;
}) {
  const { nodeId } = await params;

  const boss = getBossBattle(nodeId);
  if (boss) return <BossPlayer battle={boss} />;

  const session = getLessonSession(nodeId);
  if (!session) notFound();

  return <LessonPlayer session={session} />;
}
