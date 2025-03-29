import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Booking, Maid, CompanySettings } from "@shared/schema";
import { Loader2, UserCheck, Calendar, Settings, Check, X, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedMaid, setSelectedMaid] = useState<Maid | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [settingsFormData, setSettingsFormData] = useState({
    companyName: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    logo: "",
    servicesOffered: [] as string[],
    operatingHours: ""
  });
  
  // Queries for data fetching
  const { data: maids, isLoading: maidsLoading } = useQuery<Maid[]>({
    queryKey: ["/api/maids"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/maids");
      const data = await res.json();
      return data.maids;
    },
  });
  
  const { data: bookings, isLoading: bookingsLoading } = useQuery<Booking[]>({
    queryKey: ["/api/bookings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/bookings");
      const data = await res.json();
      return data.bookings;
    },
  });
  
  const { data: companySettings, isLoading: settingsLoading } = useQuery<CompanySettings>({
    queryKey: ["/api/company-settings"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/company-settings");
      const data = await res.json();
      return data.settings;
    }
  });
  
  // Update settings form data when settings are loaded
  useEffect(() => {
    if (companySettings) {
      setSettingsFormData({
        companyName: companySettings.companyName,
        contactEmail: companySettings.contactEmail,
        contactPhone: companySettings.contactPhone || "",
        address: companySettings.address || "",
        logo: companySettings.logo || "",
        servicesOffered: companySettings.servicesOffered || [],
        operatingHours: companySettings.operatingHours || ""
      });
    }
  }, [companySettings]);
  
  // Mutations for updating data
  const updateMaidMutation = useMutation({
    mutationFn: async ({ id, isAvailable }: { id: number, isAvailable: boolean }) => {
      const res = await apiRequest("PATCH", `/api/maids/${id}/availability`, { isAvailable });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/maids"] });
      toast({
        title: "Success",
        description: `Maid status updated successfully`,
      });
      setIsApprovalDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update maid status",
        variant: "destructive",
      });
    }
  });
  
  const updateBookingMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/bookings/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Success",
        description: "Booking status updated successfully",
      });
      setIsBookingDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update booking status",
        variant: "destructive",
      });
    }
  });
  
  const updateSettingsMutation = useMutation({
    mutationFn: async (settings: Partial<CompanySettings>) => {
      const res = await apiRequest("POST", "/api/company-settings", settings);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/company-settings"] });
      toast({
        title: "Success",
        description: "Company settings updated successfully",
      });
      setIsSettingsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update company settings",
        variant: "destructive",
      });
    }
  });
  
  // Handle actions
  const handleApproveMaid = (maid: Maid) => {
    setSelectedMaid(maid);
    setIsApprovalDialogOpen(true);
  };
  
  const handleUpdateMaidStatus = () => {
    if (selectedMaid) {
      updateMaidMutation.mutate({ 
        id: selectedMaid.id, 
        isAvailable: !selectedMaid.isAvailable 
      });
    }
  };
  
  const handleManageBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsBookingDialogOpen(true);
  };
  
  const handleUpdateBookingStatus = (status: string) => {
    if (selectedBooking) {
      updateBookingMutation.mutate({ id: selectedBooking.id, status });
    }
  };
  
  const handleUpdateSettings = () => {
    updateSettingsMutation.mutate(settingsFormData);
  };
  
  if (!user) {
    return null;
  }
  
  const isAdmin = user.role === "admin";
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }
  
  const pendingBookings = bookings?.filter(booking => booking.status === "pending") || [];
  const activeBookings = bookings?.filter(booking => booking.status === "confirmed") || [];
  const completedBookings = bookings?.filter(booking => booking.status === "completed") || [];
  const availableMaids = maids?.filter(maid => maid.isAvailable) || [];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your MaidEasy platform</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button variant="outline" className="mr-2">
            Export Data
          </Button>
          <Button>
            New Maid
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Maids
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserCheck className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">
                {maidsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : maids?.length || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {availableMaids.length} currently available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-primary mr-2" />
              <span className="text-2xl font-bold">
                {bookingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : bookings?.length || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {pendingBookings.length} pending approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Active Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : activeBookings.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : completedBookings.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Successfully completed
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="maids">Maids</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>
                A summary of your platform's performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Welcome to your MaidEasy admin dashboard. Here you can manage all aspects of your platform.</p>
              
              <div className="mt-4">
                <h3 className="font-medium mb-2">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <UserCheck className="mr-2 h-4 w-4" />
                    Approve New Maids
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Calendar className="mr-2 h-4 w-4" />
                    Manage Bookings
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    Platform Settings
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest service bookings on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {bookingsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : bookings && bookings.length > 0 ? (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                          <p className="font-medium">Booking #{booking.id}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(booking.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                            ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                            booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                            'bg-blue-100 text-blue-800'}`}
                          >
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No bookings found</p>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Available Maids</CardTitle>
                <CardDescription>
                  Maids currently available for work
                </CardDescription>
              </CardHeader>
              <CardContent>
                {maidsLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : availableMaids && availableMaids.length > 0 ? (
                  <div className="space-y-4">
                    {availableMaids.slice(0, 5).map((maid) => (
                      <div key={maid.id} className="flex justify-between items-center border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-2">
                            {maid.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{maid.name}</p>
                            <p className="text-sm text-gray-500">{maid.city}</p>
                          </div>
                        </div>
                        <div>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No available maids found</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="bookings">
          <Card>
            <CardHeader>
              <CardTitle>All Bookings</CardTitle>
              <CardDescription>
                Manage and view all booking requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings && bookings.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-5 border-b bg-gray-50 py-2 px-4 font-medium">
                    <div>ID</div>
                    <div>Customer</div>
                    <div>Service Date</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {bookings.map((booking) => (
                    <div key={booking.id} className="grid grid-cols-5 border-b py-3 px-4">
                      <div>#{booking.id}</div>
                      <div>User #{booking.userId}</div>
                      <div>{new Date(booking.bookingDate).toLocaleDateString()}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                          'bg-blue-100 text-blue-800'}`}
                        >
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mr-2"
                          onClick={() => handleManageBooking(booking)}
                        >
                          Manage
                        </Button>
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => handleUpdateBookingStatus("confirmed")}
                          >
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No bookings found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="maids">
          <Card>
            <CardHeader>
              <CardTitle>Maid Directory</CardTitle>
              <CardDescription>
                Manage maids registered on the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {maidsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : maids && maids.length > 0 ? (
                <div className="border rounded-md">
                  <div className="grid grid-cols-6 border-b bg-gray-50 py-2 px-4 font-medium">
                    <div>ID</div>
                    <div>Name</div>
                    <div>Location</div>
                    <div>Experience</div>
                    <div>Status</div>
                    <div>Actions</div>
                  </div>
                  {maids.map((maid) => (
                    <div key={maid.id} className="grid grid-cols-6 border-b py-3 px-4">
                      <div>#{maid.id}</div>
                      <div>{maid.name}</div>
                      <div>{maid.city}, {maid.locality}</div>
                      <div>{maid.experience || 'Not specified'}</div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${maid.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {maid.isAvailable ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div>
                        <Button 
                          size="sm" 
                          variant={maid.isAvailable ? "outline" : "default"}
                          className="mr-2"
                          onClick={() => handleApproveMaid(maid)}
                        >
                          {maid.isAvailable ? 'Suspend' : 'Approve'}
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No maids found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
              <CardDescription>
                Configure your MaidEasy platform settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {settingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input 
                          id="companyName" 
                          value={settingsFormData.companyName} 
                          onChange={e => setSettingsFormData({...settingsFormData, companyName: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                          id="contactEmail" 
                          type="email"
                          value={settingsFormData.contactEmail} 
                          onChange={e => setSettingsFormData({...settingsFormData, contactEmail: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactPhone">Contact Phone</Label>
                        <Input 
                          id="contactPhone" 
                          value={settingsFormData.contactPhone} 
                          onChange={e => setSettingsFormData({...settingsFormData, contactPhone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="address">Company Address</Label>
                        <Input 
                          id="address" 
                          value={settingsFormData.address} 
                          onChange={e => setSettingsFormData({...settingsFormData, address: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="operatingHours">Operating Hours</Label>
                        <Input 
                          id="operatingHours" 
                          value={settingsFormData.operatingHours} 
                          onChange={e => setSettingsFormData({...settingsFormData, operatingHours: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => setIsSettingsDialogOpen(true)}
                    disabled={updateSettingsMutation.isPending}
                  >
                    {updateSettingsMutation.isPending ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Approval Dialog */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMaid?.isAvailable ? "Suspend Maid" : "Approve Maid"}
            </DialogTitle>
            <DialogDescription>
              {selectedMaid?.isAvailable 
                ? "Are you sure you want to suspend this maid from the platform?" 
                : "Approve this maid to allow them to receive bookings."
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedMaid && (
            <div className="py-4">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mr-3">
                  {selectedMaid.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{selectedMaid.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMaid.city}, {selectedMaid.locality}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Email:</span> {selectedMaid.email}
                </div>
                <div>
                  <span className="font-medium">Phone:</span> {selectedMaid.phone}
                </div>
                <div>
                  <span className="font-medium">Experience:</span> {selectedMaid.experience || "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Services:</span> {selectedMaid.services?.join(", ") || "Not specified"}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApprovalDialogOpen(false)}>Cancel</Button>
            <Button 
              variant={selectedMaid?.isAvailable ? "destructive" : "default"}
              onClick={handleUpdateMaidStatus}
              disabled={updateMaidMutation.isPending}
            >
              {updateMaidMutation.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : selectedMaid?.isAvailable ? (
                <X className="mr-2 h-4 w-4" />
              ) : (
                <Check className="mr-2 h-4 w-4" />
              )}
              {selectedMaid?.isAvailable ? "Suspend" : "Approve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Booking Management Dialog */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Booking</DialogTitle>
            <DialogDescription>
              Update the status of this booking
            </DialogDescription>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="py-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg">Booking #{selectedBooking.id}</h3>
                <p className="text-sm text-gray-500">
                  Booked for {new Date(selectedBooking.bookingDate).toLocaleDateString()}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                <div>
                  <span className="font-medium">Customer:</span> User #{selectedBooking.userId}
                </div>
                <div>
                  <span className="font-medium">Maid:</span> #{selectedBooking.maidId}
                </div>
                <div>
                  <span className="font-medium">Service Type:</span> {selectedBooking.serviceType || "Not specified"}
                </div>
                <div>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold 
                    ${selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-blue-100 text-blue-800'}`}
                  >
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium mb-2">Update Status:</div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "pending" ? "default" : "outline"}
                    onClick={() => handleUpdateBookingStatus("pending")}
                    disabled={selectedBooking.status === "pending" || updateBookingMutation.isPending}
                  >
                    Pending
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "confirmed" ? "default" : "outline"}
                    onClick={() => handleUpdateBookingStatus("confirmed")}
                    disabled={selectedBooking.status === "confirmed" || updateBookingMutation.isPending}
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "completed" ? "default" : "outline"}
                    onClick={() => handleUpdateBookingStatus("completed")}
                    disabled={selectedBooking.status === "completed" || updateBookingMutation.isPending}
                  >
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedBooking.status === "cancelled" ? "destructive" : "outline"}
                    onClick={() => handleUpdateBookingStatus("cancelled")}
                    disabled={selectedBooking.status === "cancelled" || updateBookingMutation.isPending}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Settings Confirmation Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Platform Settings</DialogTitle>
            <DialogDescription>
              Are you sure you want to update the platform settings?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <AlertCircle className="h-16 w-16 text-primary mx-auto mb-4" />
            <p className="text-center">
              These settings will be applied platform-wide and affect all users and service providers.
            </p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSettingsDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleUpdateSettings}
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}