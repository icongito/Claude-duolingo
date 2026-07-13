"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Do I need coding experience to start?",
    a: "No. World 1 (Claude Basics) assumes zero prior experience. If you already code, you can place out of early worlds with a placement quiz.",
  },
  {
    q: "Is CodeQuest really free?",
    a: "Yes: all 25 worlds, XP, streaks, and achievements are free forever, supported by a short ad after each lesson. Premium removes the ads and adds unlimited hearts, a monthly gem stipend, and a faster AI Mentor.",
  },
  {
    q: "What can Premium buy that Free can't?",
    a: "Nothing that affects difficulty or outcomes. Every world and lesson is the same for everyone. Premium buys convenience and cosmetics: no ads, unlimited hearts, more gems, and mascot wearables. CodeQuest is never pay-to-win.",
  },
  {
    q: "How is this different from watching tutorials?",
    a: "Every lesson makes you do something: write code, fix a bug, write a prompt, resolve a merge conflict. Passive video-watching doesn't build the muscle memory that shipping real code does.",
  },
  {
    q: "Can I switch or cancel my plan anytime?",
    a: "Yes: upgrade, downgrade, or cancel whenever you want from Settings. There's no lock-in, and downgrading never takes away XP, streaks, or achievements you've already earned.",
  },
  {
    q: "What happens if I miss a day and lose my streak?",
    a: "You can earn streak freezes through play, or purchase one with coins you've already earned in-game, never with real money beyond a cosmetic season pass.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold tracking-widest text-primary uppercase">
            FAQ
          </p>
          <h2 className="font-pixel text-3xl text-foreground sm:text-4xl">
            Questions, answered
          </h2>
        </div>

        <div className="glow-border rounded-2xl bg-card px-6">
          <Accordion type="single" collapsible>
            {FAQS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
