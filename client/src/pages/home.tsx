import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import FaqSection from "@/components/faq-section";
import WaitlistForm from "@/components/waitlist-form";
import CtaSection from "@/components/cta-section";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  // Get waitlist count from API
  const { data: waitlistCount } = useQuery({
    queryKey: ['/api/waitlist/count'],
    queryFn: undefined,
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <HeroSection count={waitlistCount?.count || 500} />
        <FeaturesSection />
        <HowItWorks />
        <FaqSection />
        <WaitlistForm />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}
