import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xl">M</div>
              <span className="ml-2 text-xl font-bold text-gray-900">MaidEasy</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#services" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">Services</a>
            <a href="#how-it-works" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">How it Works</a>
            <a href="#pricing" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">Pricing</a>
            <a href="#faq" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">FAQ</a>
            <Link href="/find-maid" className="text-base font-medium text-gray-700 hover:text-primary transition-colors">Find a Maid</Link>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
          
          {/* CTA Buttons */}
          <div className="hidden md:flex space-x-4">
            <Button asChild variant="outline">
              <a href="#become-a-maid">Become a Maid</a>
            </Button>
            <Button asChild>
              <a href="#book-service">Book a Service</a>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-3 animate-in fade-in">
          <nav className="flex flex-col space-y-4">
            <a 
              href="#services" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Services
            </a>
            <a 
              href="#how-it-works" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a 
              href="#pricing" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </a>
            <a 
              href="#faq" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              FAQ
            </a>
            <Link 
              href="/find-maid" 
              className="text-base font-medium text-gray-700 hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Maid
            </Link>
            <Button asChild className="w-full justify-center mb-2" variant="outline">
              <a 
                href="#become-a-maid"
                onClick={() => setMobileMenuOpen(false)}
              >
                Become a Maid
              </a>
            </Button>
            <Button asChild className="w-full justify-center">
              <a 
                href="#book-service"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book a Service
              </a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
