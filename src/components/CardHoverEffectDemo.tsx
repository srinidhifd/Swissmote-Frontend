// src/components/CardHoverEffectDemo.tsx

import { HoverEffect } from "../../@/components/ui/card-hover-effect";

export function CardHoverEffectDemo() {
  const partners = [
    {
      title: "Stripe",
      description: "Building economic infrastructure for the internet.",
      link: "https://stripe.com",
    },
    {
      title: "Netflix",
      description: "Award-winning streaming service with diverse content.",
      link: "https://netflix.com",
    },
    {
      title: "Google",
      description: "Innovative internet-related services and products.",
      link: "https://google.com",
    },
    {
      title: "Meta",
      description: "Connecting the world through innovative products.",
      link: "https://meta.com",
    },
    {
      title: "Amazon",
      description: "Global e-commerce and AI-driven technology.",
      link: "https://amazon.com",
    },
    {
      title: "Microsoft",
      description: "Leading in software, electronics, and services.",
      link: "https://microsoft.com",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={partners} />
    </div>
  );
}
