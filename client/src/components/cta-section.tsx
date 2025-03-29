import { Button } from "@/components/ui/button";

export default function CtaSection() {
  return (
    <section className="py-12 bg-primary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold">Ready to Transform Your Workflow?</h2>
          <p className="mt-4 text-lg text-primary-foreground/80">Join thousands of others who are already on the waitlist.</p>
          <div className="mt-8">
            <Button
              variant="secondary"
              size="lg"
              asChild
            >
              <a href="#waitlist">Join Waitlist</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
