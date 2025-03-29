import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Handle redirect inside useEffect to avoid React hook errors
  useEffect(() => {
    if (user) {
      setLocation(user.role === "admin" ? "/dashboard" : "/");
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (values: LoginValues) => {
    try {
      const userData = await loginMutation.mutateAsync(values);
      toast({
        title: "Login successful",
        description: "You have successfully logged in",
      });
      setLocation(userData.role === "admin" ? "/dashboard" : "/");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    }
  };

  const onRegisterSubmit = async (values: RegisterValues) => {
    try {
      const { confirmPassword, ...registrationData } = values;
      await registerMutation.mutateAsync(registrationData);
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      });
      setLocation("/");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: "Please check the information and try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-screen hero-section">
      <div className="flex flex-col-reverse md:flex-row w-full max-w-screen-xl mx-auto p-4 md:p-8">
        {/* Auth Forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0">
          <Card className="w-full max-w-md border-cream">
            <CardHeader className="bg-cream-light rounded-t-lg">
              <CardTitle className="flex flex-col items-center gap-2 text-center text-black">
                <div className="flex items-center gap-2">
                  <img src="/images/cleandaze-logo.png" alt="CLEANDAZE Logo" className="h-8 w-auto" />
                  <span className="text-2xl font-bold text-primary bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text">CLEANDAZE</span>
                </div>
                <span className="text-xl font-bold mt-2">
                  {activeTab === "login" ? "Login to your account" : "Create an Account"}
                </span>
              </CardTitle>
              <CardDescription className="text-center text-black">
                {activeTab === "login" 
                  ? "Enter your credentials to access your account" 
                  : "Sign up to start booking maid services"}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-cream">
                  <TabsTrigger value="login" className="data-[state=active]:bg-cream-dark data-[state=active]:text-black">Login</TabsTrigger>
                  <TabsTrigger value="register" className="data-[state=active]:bg-cream-dark data-[state=active]:text-black">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your username" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-cream hover:bg-cream-dark text-black" 
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="johndoe" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Confirm your password" {...field} className="border-cream" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-cream hover:bg-cream-dark text-black" 
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Create account"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-black">
                {activeTab === "login" 
                  ? "Don't have an account? " 
                  : "Already have an account? "}
                <Button 
                  variant="link" 
                  className="p-0 text-black" 
                  onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                >
                  {activeTab === "login" ? "Sign up" : "Login"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Hero Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div className="max-w-lg mx-auto md:mx-0 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-black">
              Welcome to 
              <div className="flex items-center gap-2 mt-2 justify-center md:justify-start">
                <img src="/images/cleandaze-logo.png" alt="CLEANDAZE Logo" className="h-10 w-auto inline-block" />
                <span className="bg-gradient-to-r from-primary to-yellow-500 text-transparent bg-clip-text font-bold underline decoration-cream-dark decoration-4">CLEANDAZE</span>
              </div>
            </h1>
            <p className="text-xl mb-6 text-black">
              India's most affordable and accessible maid service platform. Connect with trusted maids in your area and book services with just a few clicks.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="mr-4 bg-cream p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">Verified Maids</h3>
                  <p className="text-black/75">All maids on our platform are verified and trusted</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-cream p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                    <line x1="9" y1="9" x2="9.01" y2="9"></line>
                    <line x1="15" y1="9" x2="15.01" y2="9"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">Customer Satisfaction</h3>
                  <p className="text-black/75">Your satisfaction is our top priority</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="mr-4 bg-cream p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-black">Fast & Reliable</h3>
                  <p className="text-black/75">Book a maid service in minutes, not days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}