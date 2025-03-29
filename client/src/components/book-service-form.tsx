import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { insertWaitlistSchema } from "@shared/schema";
import { Loader2, CheckCircle2 } from "lucide-react";

// Extended schema with additional fields
const formSchema = insertWaitlistSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter your full address.",
  }),
  city: z.string().min(2, {
    message: "Please select your city.",
  }),
  serviceType: z.string({
    required_error: "Please select a service type.",
  }),
  date: z.string({
    required_error: "Please select a date for service.",
  }),
  timeSlot: z.string({
    required_error: "Please select a time slot.",
  }),
  specialInstructions: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy and terms of service."
  })
});

type FormValues = z.infer<typeof formSchema>;

// Service types
const serviceTypes = [
  { value: "regular", label: "Regular Cleaning" },
  { value: "deep", label: "Deep Cleaning" },
  { value: "onetime", label: "One-time Service" },
  { value: "subscription", label: "Subscription Plan" }
];

// Time slots
const timeSlots = [
  { value: "morning", label: "Morning (7 AM - 11 AM)" },
  { value: "afternoon", label: "Afternoon (11 AM - 3 PM)" },
  { value: "evening", label: "Evening (3 PM - 8 PM)" }
];

// Major cities in India
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana"
].sort();

export default function BookServiceForm() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      serviceType: "",
      date: "",
      timeSlot: "",
      specialInstructions: "",
      privacyPolicy: false
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    
    try {
      // Extract only the fields we want to send to the API
      const { privacyPolicy, ...dataToSubmit } = values;
      
      // This will send to the waitlist API for now
      // In a real implementation, we would create a separate API endpoint for booking
      const response = await apiRequest("POST", "/api/waitlist", dataToSubmit);
      const result = await response.json();
      
      setSuccess(true);
      toast({
        title: "Booking Successful!",
        description: "Your maid service has been booked. We'll send a confirmation email with details shortly.",
      });
      
    } catch (error) {
      let errorMessage = "Failed to book service. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle duplicate email error or other specific errors
        if (errorMessage.includes("409")) {
          errorMessage = "You already have a pending booking with this email.";
        }
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      
    } finally {
      setSubmitting(false);
    }
  }

  // Get tomorrow's date in YYYY-MM-DD format
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().split('T')[0];

  return (
    <section id="book-service" className="py-12 md:py-24 bg-primary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Book a Maid Service</h2>
          <p className="mt-4 text-xl text-gray-600">
            Fill out the form below to book a professional maid service for your home
          </p>
          
          {/* Booking Form */}
          <div className="mt-10 p-6 sm:p-8 bg-white rounded-xl shadow-lg">
            {!success ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 1234567890" type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>City</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your city" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {cities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>Full Address</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your complete address with house/apartment number, street, landmark, etc." 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Service Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="serviceType"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Service Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select service" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {serviceTypes.map((service) => (
                                <SelectItem key={service.value} value={service.value}>{service.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" min={tomorrowString} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeSlot"
                      render={({ field }) => (
                        <FormItem className="text-left">
                          <FormLabel>Time Slot</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot.value} value={slot.value}>{slot.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="specialInstructions"
                    render={({ field }) => (
                      <FormItem className="text-left">
                        <FormLabel>Special Instructions (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any special requirements or instructions for the maid?" 
                            className="min-h-[80px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I agree to the <a href="#" className="text-primary hover:text-primary/80">Privacy Policy</a> and <a href="#" className="text-primary hover:text-primary/80">Terms of Service</a>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full mt-6" 
                    disabled={submitting}
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Book Now"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-800 mb-2">Booking Successful!</h3>
                <p className="text-green-700 mb-4">
                  Your maid service has been booked successfully. We'll send a confirmation email with all the details shortly.
                </p>
                <p className="text-green-700 mb-6">
                  A customer service representative will also call you 24 hours before the scheduled service to confirm.
                </p>
                <Button onClick={() => setSuccess(false)}>Book Another Service</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}