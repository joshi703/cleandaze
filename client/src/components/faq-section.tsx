import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I book a maid service?",
    answer: "You can book a service through our website or mobile app. Simply select the type of service you need, choose a convenient date and time, provide your address details, and confirm your booking."
  },
  {
    question: "What areas do you serve in India?",
    answer: "CLEANDAZE is available in all major cities across India including Delhi, Mumbai, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, and more. We're rapidly expanding to tier-2 and tier-3 cities as well."
  },
  {
    question: "How much does the service cost?",
    answer: "Our pricing starts from as low as ₹299 for basic cleaning services. The exact cost depends on the type of service, size of your home, and your location. You can get an instant quote by entering your requirements through our booking form."
  },
  {
    question: "Are your maids verified and trustworthy?",
    answer: "Yes, all our maids undergo a thorough verification process including background checks, skill assessment, and training. We verify their identity, address, and previous work experience before they join our platform."
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer: "Customer satisfaction is our top priority. If you're not satisfied with the service, please report it within 24 hours and we'll arrange for a re-cleaning at no additional cost. We also offer partial or full refunds depending on the situation."
  },
  {
    question: "Can I request the same maid for regular cleaning?",
    answer: "Yes, if you like a particular maid's service, you can request the same professional for future bookings. This option is available for subscription plans, subject to the maid's availability."
  },
  {
    question: "What cleaning supplies are used?",
    answer: "Our maids bring their own basic cleaning equipment. However, for specific cleaning products, you may need to provide them or you can request premium cleaning packages where we provide eco-friendly cleaning supplies at an additional cost."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">Everything you need to know about our maid services</p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200 py-2">
                <AccordionTrigger className="text-lg font-medium text-gray-900 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
