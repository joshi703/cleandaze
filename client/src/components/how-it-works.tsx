import { Button } from "@/components/ui/button";

const steps = [
  {
    number: 1,
    title: "Book a Service",
    description: "Select the cleaning service you need and choose a convenient date and time slot."
  },
  {
    number: 2,
    title: "Get Matched",
    description: "We'll match you with a verified, experienced maid professional in your area."
  },
  {
    number: 3,
    title: "Hassle-free Cleaning",
    description: "Your assigned professional will arrive on time and complete the cleaning to your satisfaction."
  },
  {
    number: 4,
    title: "Pay Securely",
    description: "Pay only after the service is completed to your satisfaction. Multiple payment options available."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-4 text-xl text-gray-600">Book a professional maid service in just a few simple steps</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="absolute top-0 left-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">{step.number}</div>
              <div className="pt-2 pl-16">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 right-0 transform translate-x-1/2">
                  <svg className="h-4 w-12 text-primary/30" viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M47.7071 8.70711C48.0976 8.31658 48.0976 7.68342 47.7071 7.29289L41.3431 0.928932C40.9526 0.538408 40.3195 0.538408 39.9289 0.928932C39.5384 1.31946 39.5384 1.95262 39.9289 2.34315L45.5858 8L39.9289 13.6569C39.5384 14.0474 39.5384 14.6805 39.9289 15.0711C40.3195 15.4616 40.9526 15.4616 41.3431 15.0711L47.7071 8.70711ZM0 9H47V7H0V9Z" fill="currentColor"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button asChild size="lg" className="px-8">
            <a href="#book-service">Book Your First Cleaning</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
