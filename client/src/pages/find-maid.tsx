import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, Mail, Calendar, Briefcase } from "lucide-react";
import type { Maid } from "@shared/schema";

// Major cities in India
const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
  "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
  "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane",
  "Bhopal", "Visakhapatnam", "Patna", "Vadodara", "Ludhiana"
].sort();

export default function FindMaid() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [localitySearch, setLocalitySearch] = useState("");
  
  interface MaidsResponse {
    maids: Maid[];
  }
  
  // Query to fetch all maids
  const { data: allMaids, isLoading: loadingAllMaids } = useQuery<MaidsResponse>({
    queryKey: ['/api/maids'],
    enabled: !selectedCity && !localitySearch,
  });
  
  // Query to fetch maids by city
  const { data: cityMaids, isLoading: loadingCityMaids } = useQuery<MaidsResponse>({
    queryKey: ['/api/maids/city', selectedCity],
    enabled: !!selectedCity,
  });
  
  // Query to fetch maids by locality
  const { data: localityMaids, isLoading: loadingLocalityMaids } = useQuery<MaidsResponse>({
    queryKey: ['/api/maids/locality', localitySearch],
    enabled: !!localitySearch && localitySearch.length > 2,
  });
  
  // Determine which set of maids to display
  const maids = localitySearch && localitySearch.length > 2 
    ? localityMaids?.maids 
    : selectedCity 
      ? cityMaids?.maids 
      : allMaids?.maids || [];
  
  const isLoading = loadingAllMaids || loadingCityMaids || loadingLocalityMaids;
  
  // Handle changing the selected city
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setLocalitySearch("");
  };
  
  // Handle clearing filters
  const handleClearFilters = () => {
    setSelectedCity(null);
    setLocalitySearch("");
  };
  
  return (
    <section className="py-12 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">Find Maids Near You</h1>
          <p className="mt-4 text-xl text-gray-600 text-center mb-8">
            Search for qualified maids in your area and get started today
          </p>
          
          {/* Search/Filter Controls */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by City
                </label>
                <Select value={selectedCity || ""} onValueChange={handleCityChange}>
                  <SelectTrigger id="city-filter" className="w-full">
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="locality-search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Locality
                </label>
                <Input
                  id="locality-search"
                  placeholder="Enter locality, area, or neighborhood"
                  value={localitySearch}
                  onChange={(e) => setLocalitySearch(e.target.value)}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={handleClearFilters}
                  className="w-full"
                  disabled={!selectedCity && !localitySearch}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Count */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {isLoading 
                ? "Finding maids..." 
                : maids && maids.length > 0 
                  ? `${maids.length} Maids Available` 
                  : "No maids found"}
            </h2>
          </div>
          
          {/* Maids List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-0">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="mt-4 space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-10 w-full" />
                  </CardFooter>
                </Card>
              ))
            ) : maids && maids.length > 0 ? (
              maids.map((maid: Maid) => (
                <Card key={maid.id} className="overflow-hidden">
                  <CardHeader>
                    <CardTitle>{maid.name}</CardTitle>
                    <CardDescription className="flex items-center text-sm space-x-1">
                      <MapPin className="h-4 w-4 inline-block" />
                      <span>{maid.locality}, {maid.city}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Joined {new Date(maid.joinedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{maid.experience || "Experience not specified"}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{maid.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{maid.email}</span>
                      </div>
                    </div>
                    
                    {maid.services && maid.services.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-muted-foreground mb-2">Services:</p>
                        <div className="flex flex-wrap gap-2">
                          {maid.services.map((service, i) => (
                            <Badge key={i} variant="outline">{service}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full">
                      <a href="/#book-service">Book Now</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No maids found matching your criteria.</p>
                <p className="mt-2">Try adjusting your search filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}