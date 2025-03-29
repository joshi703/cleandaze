import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  count: number;
}

export default function HeroSection({ count = 500 }: HeroSectionProps) {
  return (
    <section className="pt-16 md:pt-24 pb-12 md:pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:gap-12">
          <div className="lg:w-1/2 animate-in fade-in">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <svg className="mr-1.5 h-2 w-2 text-primary" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
              Coming Soon
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Revolutionize Your <span className="text-primary">Digital Experience</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl">
              Our innovative platform helps you streamline workflows, boost productivity, 
              and achieve your goals faster than ever before.
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row sm:gap-4">
              <Button 
                size="lg" 
                className="mb-4 sm:mb-0 transition-all transform hover:scale-105"
                asChild
              >
                <a href="#waitlist" className="inline-flex items-center">
                  Join Waitlist
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#how-it-works">
                  Learn More
                </a>
              </Button>
            </div>
            
            <div className="mt-8 flex items-center text-gray-500">
              <div className="flex -space-x-2 overflow-hidden">
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User avatar"
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User avatar"
                />
                <img 
                  className="inline-block h-8 w-8 rounded-full ring-2 ring-white" 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="User avatar"
                />
                <span className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">+{count - 3}</span>
              </div>
              <span className="ml-3 text-sm">Join over <span className="font-semibold">{count}+</span> people already on the waitlist</span>
            </div>
          </div>
          
          <div className="hidden lg:block lg:w-1/2 mt-10 lg:mt-0 animate-in slide-in-from-bottom">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse duration-3000"></div>
              <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-yellow-500 rounded-full blur-3xl opacity-20 animate-pulse duration-3000"></div>
              <div className="relative">
                <img 
                  className="w-full rounded-2xl shadow-2xl" 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Product screenshot"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
