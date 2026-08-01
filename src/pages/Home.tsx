import { Benefits } from "@/components/Benefits";
import { CTA } from "@/components/CTA";
import { Eligibility } from "@/components/Eligibility";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";
import { Specialist } from "@/components/Specialist";

export default function Home() {
  return (
    <>
      <div className="pb-24 md:pb-0">
        <Header />
        <main>
          <Hero />
          <Benefits />
          <Eligibility />
          <HowItWorks />
          <Specialist />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
      <MobileStickyCTA />
    </>
  );
}
