import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

// Gallery images - replace these with real image imports later
const galleryImages = [
  {
    id: 1,
    title: "Professional house cleaning",
    category: "Cleaning",
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=1000",
    alt: "Professional house cleaning service",
  },
  {
    id: 2,
    title: "Kitchen deep cleaning",
    category: "Cleaning",
    src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1000",
    alt: "Kitchen deep cleaning service",
  },
  {
    id: 3,
    title: "Bathroom cleaning",
    category: "Cleaning",
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000",
    alt: "Bathroom cleaning service",
  },
  {
    id: 4,
    title: "Professional cooking",
    category: "Cooking",
    src: "https://images.unsplash.com/photo-1556910096-6f5e72db6803?q=80&w=1000",
    alt: "Professional cooking service",
  },
  {
    id: 5,
    title: "Child care",
    category: "Child Care",
    src: "https://images.unsplash.com/photo-1576525444145-423f0e6e9a0e?q=80&w=1000",
    alt: "Child care service",
  },
  {
    id: 6,
    title: "Elder care",
    category: "Elder Care",
    src: "https://images.unsplash.com/photo-1581579438747-50b21689623b?q=80&w=1000",
    alt: "Elder care service",
  },
  {
    id: 7,
    title: "Laundry service",
    category: "Laundry",
    src: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1000",
    alt: "Laundry service",
  },
  {
    id: 8,
    title: "Kitchen organization",
    category: "Organization",
    src: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?q=80&w=1000",
    alt: "Kitchen organization service",
  },
  {
    id: 9,
    title: "Home office cleaning",
    category: "Cleaning",
    src: "https://images.unsplash.com/photo-1498758536662-35b82cd15e29?q=80&w=1000",
    alt: "Home office cleaning service",
  },
  {
    id: 10, 
    title: "Family meal preparation",
    category: "Cooking",
    src: "https://images.unsplash.com/photo-1592861956120-e524fc739696?q=80&w=1000",
    alt: "Family meal preparation service",
  },
  {
    id: 11,
    title: "Outdoor cleaning",
    category: "Cleaning",
    src: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=1000",
    alt: "Outdoor cleaning service",
  },
  {
    id: 12,
    title: "Tidying up living room",
    category: "Organization",
    src: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=1000",
    alt: "Living room organization service",
  }
];

// Categories for filtering
const categories = ["All", "Cleaning", "Cooking", "Child Care", "Elder Care", "Laundry", "Organization"];

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  // Filter images based on selected category
  const filteredImages = selectedCategory === "All" 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Service Gallery</h1>
          <p className="mt-4 text-xl text-gray-600 text-center mb-8">
            Browse our gallery of professional maid services
          </p>
          
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-10">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="mb-2"
              >
                {category}
              </Button>
            ))}
          </div>
          
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredImages.map(image => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <div 
                    className="overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="aspect-w-4 aspect-h-3 relative">
                      <img 
                        src={image.src} 
                        alt={image.alt}
                        className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-gray-900">{image.title}</h3>
                      <p className="text-sm text-gray-500">{image.category}</p>
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="sm:max-w-xl md:max-w-2xl">
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      className="w-full h-auto object-contain rounded-lg" 
                    />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-xl font-semibold">{image.title}</h3>
                    <p className="text-gray-500">{image.category}</p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          
          {filteredImages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No images found for this category.</p>
            </div>
          )}
          
          {/* Booking CTA */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to experience our services?</h2>
            <Button asChild size="lg" className="mt-2">
              <a href="/#book-service">Book a Service Now</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}