import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Booking, Maid } from "@shared/schema";
import { Loader2, UserCheck, Calendar, Settings } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
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
                        <Button size="sm" variant="outline" className="mr-2">View</Button>
                        {booking.status === 'pending' && (
                          <Button size="sm">Approve</Button>
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
                        <Button size="sm" variant="outline" className="mr-2">View</Button>
                        <Button size="sm">Edit</Button>
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
              <p className="text-gray-500 mb-4">
                Platform settings will be implemented soon. Here, you'll be able to configure pricing,
                service areas, commission rates, and other platform settings.
              </p>
              <Button disabled>Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}