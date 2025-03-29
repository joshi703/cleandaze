import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import FeaturesSection from "@/components/features-section";
import HowItWorks from "@/components/how-it-works";
import PricingSection from "@/components/pricing-section";
import FaqSection from "@/components/faq-section";
import BookServiceForm from "@/components/book-service-form";
import BecomeMaidForm from "@/components/become-maid-form";
import CtaSection from "@/components/cta-section";
import { useQuery } from "@tanstack/react-query";

// Type for the response from /api/waitlist/count
interface CountResponse {
  count: number;
}

export default function Home() {
  // Get customer count from API
  const { data } = useQuery<CountResponse>({
    queryKey: ['/api/waitlist/count'],
  });
  
  // Use 500 as fallback if data isn't loaded yet
  const count = data?.count ?? 500;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        <HeroSection count={count} />
        <FeaturesSection />
        <HowItWorks />
        <PricingSection />
        <BookServiceForm />
        <BecomeMaidForm />
        <FaqSection />
        <CtaSection />
      </main>
      
      <Footer />
    </div>
  );
}
