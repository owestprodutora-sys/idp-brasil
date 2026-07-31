import { Benefits } from "@/components/Benefits";
import { CTA } from "@/components/CTA";
import { Eligibility } from "@/components/Eligibility";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Specialist } from "@/components/Specialist";

export default function Home() {
  return (
    <>
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
    </>
  );
}
