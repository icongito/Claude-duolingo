import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = [
  {
    q: "Is any learning content locked behind Premium?",
    a: "No. All 25 worlds, every lesson, every boss battle, and all achievements are free. Premium buys convenience (unlimited hearts), protection (streak repair), and a smarter AI Mentor — never content or answers.",
  },
  {
    q: "What are gems and why are they so hard to get?",
    a: "Gems are the scarce currency for streak protection and Little Guy cosmetics. You earn them from weekly quests, one-time special quests, and boss first-clears — roughly 5-10 per week, capped at 25. Scarcity is the point: a Streak Crown means something because you can't grind it out in an afternoon.",
  },
  {
    q: "Does buying gems give me an advantage?",
    a: "No. Gems can't buy XP, answers, quiz retakes that skip questions, or leaderboard position. Streak freezes protect what you already earned; wearables are pixels on a very good boy.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from Settings → Billing and you keep Premium until the end of the paid period. No partial-month clawbacks, no retention maze.",
  },
  {
    q: "What's the difference between the mentor models?",
    a: "Free uses a fast model good for quick hints. Premium tiers use a smarter model with deeper reasoning for tricky debugging conversations, plus much higher daily message limits.",
  },
];

export function PremiumFaq() {
  return (
    <section className="mx-auto w-full max-w-2xl">
      <h2 className="font-display mb-2 text-xl font-bold">Questions</h2>
      <Accordion type="single" collapsible>
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
