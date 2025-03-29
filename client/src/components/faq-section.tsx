import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "When will the product launch?",
    answer: "We're planning to launch in Q3 of this year. By joining the waitlist, you'll be among the first to know when we go live and get early access."
  },
  {
    question: "Will there be a free plan?",
    answer: "Yes, we'll offer a free tier with essential features. Premium plans will be available for users who need advanced capabilities."
  },
  {
    question: "How secure is my data?",
    answer: "Security is our top priority. We use industry-standard encryption, regular security audits, and strict access controls to protect your data."
  },
  {
    question: "What platforms do you support?",
    answer: "Our product will be available on web, iOS, and Android at launch, with desktop applications coming shortly after."
  },
  {
    question: "Is there a referral program?",
    answer: "Yes! After joining the waitlist, you'll receive a unique referral link. For each friend who signs up with your link, you'll both get additional benefits at launch."
  }
];

export default function FaqSection() {
  return (
    <section id="faq" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">Everything you need to know about our product</p>
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
