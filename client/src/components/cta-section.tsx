import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Ready for a Cleaner Home?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">Book your first service today and enjoy a spotless, comfortable home.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              asChild
            >
              <a href="#book-service">Book a Service</a>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/20"
              asChild
            >
              <a href="#become-a-maid">Become a Maid</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
