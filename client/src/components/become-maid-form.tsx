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
import { insertMaidSchema } from "@shared/schema";
import { Loader2, CheckCircle2 } from "lucide-react";

// Extended schema with additional fields for maid registration
const formSchema = insertMaidSchema.extend({
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
  age: z.string().min(1, {
    message: "Please enter your age.",
  }),
  gender: z.string({
    required_error: "Please select your gender.",
  }),
  experience: z.string({
    required_error: "Please select your experience level.",
  }),
  skillsSets: z.string().min(1, {
    message: "Please indicate your cleaning skills.",
  }),
  availabilityTime: z.string({
    required_error: "Please select your availability time.",
  }),
  availabilityDays: z.string({
    required_error: "Please select your availability days.",
  }),
  idType: z.string({
    required_error: "Please select ID type for verification.",
  }),
  idNumber: z.string().min(1, {
    message: "Please enter your ID number.",
  }),
  resume: z.string().optional(),
  privacyPolicy: z.boolean().refine(val => val === true, {
    message: "You must agree to the privacy policy and terms of service."
  }),
  backgroundCheckConsent: z.boolean().refine(val => val === true, {
    message: "You must consent to a background verification check."
  })
});

type FormValues = z.infer<typeof formSchema>;

// Experience levels
const experienceLevels = [
  { value: "0-1", label: "0-1 years" },
  { value: "1-3", label: "1-3 years" },
  { value: "3-5", label: "3-5 years" },
  { value: "5+", label: "5+ years" }
];

// Availability times
const availabilityTimes = [
  { value: "morning", label: "Morning (7 AM - 11 AM)" },
  { value: "afternoon", label: "Afternoon (11 AM - 3 PM)" },
  { value: "evening", label: "Evening (3 PM - 8 PM)" },
  { value: "flexible", label: "Flexible (Any time)" }
];

// Availability days
const availabilityDays = [
  { value: "weekdays", label: "Weekdays only" },
  { value: "weekends", label: "Weekends only" },
  { value: "all", label: "All days" },
  { value: "custom", label: "Custom schedule" }
];

// ID Types
const idTypes = [
  { value: "aadhar", label: "Aadhar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "voter", label: "Voter ID" },
  { value: "driving", label: "Driving License" }
];

// Major cities in India
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana"
].sort();

export default function BecomeMaidForm() {
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
      age: "",
      gender: "",
      experience: "",
      skillsSets: "",
      availabilityTime: "",
      availabilityDays: "",
      idType: "",
      idNumber: "",
      resume: "",
      privacyPolicy: false,
      backgroundCheckConsent: false
    },
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    
    try {
      // Extract fields needed for the maid registration API
      const {
        privacyPolicy,
        backgroundCheckConsent,
        age,
        gender,
        skillsSets,
        availabilityTime,
        availabilityDays,
        idType,
        idNumber,
        resume,
        ...maidData
      } = values;
      
      // Create services array from skills
      const services = [skillsSets];
      
      // Add locality field from skillsSets or a default value (required by schema)
      const locality = values.address.split(',').pop()?.trim() || 'Unknown';
      
      // Prepare data for API
      const dataToSubmit = {
        ...maidData,
        locality,
        services
      };
      
      // Send to the maids API endpoint
      const response = await apiRequest("POST", "/api/maids", dataToSubmit);
      const result = await response.json();
      
      setSuccess(true);
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. We'll contact you shortly for the next steps.",
      });
      
    } catch (error) {
      let errorMessage = "Failed to submit application. Please try again.";
      
      if (error instanceof Error) {
        errorMessage = error.message;
        
        // Handle duplicate email error or other specific errors
        if (errorMessage.includes("409")) {
          errorMessage = "An application with this email already exists.";
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

  return (
    <section id="become-a-maid" className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Become a CLEANDAZE Professional</h2>
          <p className="mt-4 text-xl text-gray-600">
            Join our network of trusted maid professionals and earn a steady income
          </p>
          
          {/* Benefits */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Flexible Hours</h3>
              <p className="text-gray-600">Choose your own working hours and days that fit your schedule</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Competitive Pay</h3>
              <p className="text-gray-600">Earn above-market rates with additional tips from satisfied customers</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Safety First</h3>
              <p className="text-gray-600">Work with verified clients in safe environments with our protection policies</p>
            </div>
          </div>
          
          {/* Application Form */}
          <div className="mt-12 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200 text-left">
            {!success ? (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
                  
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                      name="age"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Age</FormLabel>
                          <FormControl>
                            <Input placeholder="Your age" type="number" min="18" max="65" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
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
                      <FormItem>
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
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pt-4">Professional Details</h3>
                  
                  {/* Professional Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Level</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {experienceLevels.map((level) => (
                                <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availabilityTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability Time</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availabilityTimes.map((time) => (
                                <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="availabilityDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Availability Days</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select days" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {availabilityDays.map((day) => (
                                <SelectItem key={day.value} value={day.value}>{day.label}</SelectItem>
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
                    name="skillsSets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills & Experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your cleaning skills, experience, and any specialties (e.g., deep cleaning, organizing, etc.)" 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-6 pt-4">Verification Details</h3>
                  
                  {/* Verification Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="idType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select ID type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {idTypes.map((id) => (
                                <SelectItem key={id.value} value={id.value}>{id.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your ID number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="resume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information you'd like us to know about you or your experiences" 
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
                    name="backgroundCheckConsent"
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
                            I consent to a background verification check which is mandatory to join the CLEANDAZE platform
                          </FormLabel>
                          <FormMessage />
                        </div>
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
                        Submitting Application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-800 mb-2">Application Submitted!</h3>
                <p className="text-green-700 mb-4">
                  Your application has been submitted successfully. Our team will review your details and contact you within 2-3 business days.
                </p>
                <p className="text-green-700 mb-6">
                  The next steps will include a video or in-person interview and document verification.
                </p>
                <Button onClick={() => setSuccess(false)}>Submit Another Application</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}