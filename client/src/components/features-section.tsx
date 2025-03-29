import { 
  Sparkles, 
  Clock, 
  Calendar, 
  Repeat, 
  Shield, 
  Star
} from "lucide-react";

const services = [
  {
    icon: <Sparkles className="h-6 w-6 text-primary" />,
    title: "Regular Cleaning",
    description: "Professional regular cleaning services for your home at an affordable rate. Includes dusting, mopping, and basic home organization."
  },
  {
    icon: <Star className="h-6 w-6 text-primary" />,
    title: "Deep Cleaning",
    description: "Thorough cleaning of your entire home, reaching corners and areas that regular cleaning might miss. Perfect for seasonal cleaning."
  },
  {
    icon: <Calendar className="h-6 w-6 text-primary" />,
    title: "One-time Service",
    description: "Need a quick clean before guests arrive? Book a one-time cleaning service without any long-term commitment."
  },
  {
    icon: <Repeat className="h-6 w-6 text-primary" />,
    title: "Subscription Plans",
    description: "Save more with our weekly, bi-weekly, or monthly subscription cleaning plans. Flexible scheduling to fit your needs."
  },
  {
    icon: <Shield className="h-6 w-6 text-primary" />,
    title: "Verified Professionals",
    description: "All our maids undergo strict background checks and training. Trust your home with our verified professionals."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Flexible Timing",
    description: "Book services at your convenience. Flexible time slots available from 7 AM to 8 PM, all seven days of the week."
  }
];

export default function FeaturesSection() {
  return (
    <section id="services" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Services</h2>
          <p className="mt-4 text-xl text-gray-600">Professional maid services to meet all your home cleaning needs</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/10"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
