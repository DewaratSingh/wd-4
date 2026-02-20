import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Impact } from "@/components/landing/Impact";
import { CTAFooter } from "@/components/landing/CTAFooter";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <Impact />
      <CTAFooter />
    </main>
  );
}

