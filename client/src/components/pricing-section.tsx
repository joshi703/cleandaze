import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Basic",
    price: "₹299",
    description: "Per visit",
    features: [
      "Basic home cleaning",
      "Dusting and mopping",
      "Bathroom cleaning",
      "Kitchen surface cleaning",
      "Trash removal",
    ],
    popular: false,
    cta: "Book Now"
  },
  {
    name: "Standard",
    price: "₹2,499",
    description: "Monthly (4 visits)",
    features: [
      "All Basic features",
      "Deep kitchen cleaning",
      "Appliance exterior cleaning",
      "Window sill cleaning",
      "Weekly scheduling",
      "Same maid guarantee"
    ],
    popular: true,
    cta: "Most Popular"
  },
  {
    name: "Premium",
    price: "₹4,999",
    description: "Monthly (8 visits)",
    features: [
      "All Standard features",
      "Deep cleaning twice a month",
      "Inside cabinet organization",
      "Refrigerator cleaning",
      "Oven cleaning",
      "Priority customer support"
    ],
    popular: false,
    cta: "Book Now"
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Affordable Pricing</h2>
          <p className="mt-4 text-xl text-gray-600">Choose a plan that works for your needs</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white rounded-xl shadow-lg border overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${plan.popular ? 'border-primary ring-2 ring-primary/20 relative' : 'border-gray-200'}`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-semibold px-3 py-1 uppercase tracking-wider transform translate-x-2 -translate-y-1/2 rotate-45">
                  Popular
                </div>
              )}
              <div className="p-6 md:p-8">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="ml-1 text-sm text-gray-500">{plan.description}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {plan.name === "Basic" 
                    ? "Perfect for one-time cleaning needs" 
                    : plan.name === "Standard" 
                      ? "Our most popular choice for regular cleaning" 
                      : "Comprehensive cleaning for large homes"}
                </p>
                
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Button 
                    className={`w-full justify-center ${plan.popular ? '' : 'bg-white text-primary border-primary hover:bg-primary/10'}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    <a href="#book-service">{plan.cta}</a>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center text-gray-600 max-w-3xl mx-auto">
          <p className="text-sm">
            All plans include verified professionals, customer support, and 100% satisfaction guarantee. 
            Additional charges may apply for extra services or larger homes. 
            <a href="#" className="text-primary hover:underline ml-1">View our complete pricing details</a>.
          </p>
        </div>
      </div>
    </section>
  );
}