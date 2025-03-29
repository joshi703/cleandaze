import { 
  Zap, 
  Lock, 
  Layers, 
  BarChart, 
  MessageSquare, 
  Clock 
} from "lucide-react";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-primary" />,
    title: "Lightning Fast",
    description: "Experience unparalleled speed with our optimized platform, designed for maximum efficiency."
  },
  {
    icon: <Lock className="h-6 w-6 text-primary" />,
    title: "Rock-Solid Security",
    description: "Your data is protected with enterprise-grade security measures and end-to-end encryption."
  },
  {
    icon: <Layers className="h-6 w-6 text-primary" />,
    title: "Seamless Integration",
    description: "Connect with your favorite tools and platforms for a unified workflow experience."
  },
  {
    icon: <BarChart className="h-6 w-6 text-primary" />,
    title: "Advanced Analytics",
    description: "Gain valuable insights with comprehensive analytics and detailed reporting tools."
  },
  {
    icon: <MessageSquare className="h-6 w-6 text-primary" />,
    title: "24/7 Support",
    description: "Our dedicated support team is available around the clock to assist with any questions."
  },
  {
    icon: <Clock className="h-6 w-6 text-primary" />,
    title: "Time-Saving Automation",
    description: "Automate repetitive tasks and focus on what truly matters to your business."
  }
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Powerful Features</h2>
          <p className="mt-4 text-xl text-gray-600">Everything you need to transform your workflow</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl p-8 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-primary/10"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
