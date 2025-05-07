'use client';

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import '@/app/globals.css'
import { DashboardControl } from '@/components/dashboard/DashboardControl'
import { FilterSection } from '@/components/dashboard/FilterSection'
import { MapViewTab } from '@/components/dashboard/MapViewTab'
import { ListView } from '@/components/dashboard/ListView'
import useItineraries from '@/hooks/useItineraries'
import { ItineraryFilters } from '@/types'
import useAuthToken from '@/hooks/useAuth'

export default function DashboardPage() {
  const router = useRouter()
  const { isLoaded, userId } = useAuth()
  const { authToken } = useAuthToken()

  // State definitions
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [areaName, setAreaName] = useState<string>("Your Area");
  const [showFilters, setShowFilters] = useState<boolean>(true);
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const [sortOption, setSortOption] = useState<'nearest' | 'recent' | 'popular'>('nearest');
  const [activeTab, setActiveTab] = useState<string>("map");
  const fetchedRatingsRef = useRef<boolean>(false);
  
  // Set up itineraries hook
  const {
    itinerariesData,
    savedItineraries,
    likedItineraries,
    selectedItineraryId,
    itinerarySpots,
    selectedItineraryForDetails,
    fetchItineraries,
    handleSelectItinerary,
    toggleSaveItinerary,
    toggleLikeItinerary,
    setSelectedItineraryForDetails,
    fetchItineraryAverageRating,
  } = useItineraries({ 
    userId: userId as string, 
    authToken
  });

  // Authentication check
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push('/');
    }
  }, [isLoaded, userId, router]);

  // Get user location and area name
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          try {
            const response = await fetch(`/api/geocode?lat=${latitude}&lng=${longitude}`);
            if (response.ok) {
              const data = await response.json();
              if (data.address) {
                const area = data.address.suburb || data.address.neighbourhood || 
                             data.address.city_district || "Your Area";
                setAreaName(area);
              }
            }
          } catch (error) {
            console.error("Error getting area name:", error);
          }
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Apply filters and fetch itineraries
  useEffect(() => {
    const filters: ItineraryFilters = {
      activeFilters,
      distanceFilter,
      sortOption
    };
    
    fetchItineraries(filters, userLocation);
    // Reset the ratings fetch flag when filters change
    fetchedRatingsRef.current = false;
  }, [activeFilters, distanceFilter, sortOption, userLocation, fetchItineraries]);

  // Fetch ratings in a separate effect to avoid infinite loops
  useEffect(() => {
    if (itinerariesData.length > 0 && !fetchedRatingsRef.current) {
      // Set flag to true to prevent re-fetching
      fetchedRatingsRef.current = true;
      
      // Fetch ratings for each itinerary
      itinerariesData.forEach(itinerary => {
        fetchItineraryAverageRating(itinerary.id);
      });
    }
  }, [itinerariesData, fetchItineraryAverageRating]);

  // UI interaction handlers
  const toggleFilter = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter) 
        : [...prev, filter]
    );
  };
  
  const toggleShowFilters = () => setShowFilters(!showFilters);

  const showItineraryDetails = (itineraryId: number | null) => {
    if (itineraryId) {
      setSelectedItineraryForDetails(itineraryId);
      setActiveTab("list");
    }
  };

  const handleViewItineraryOnMap = (itineraryId: number) => {
    handleSelectItinerary(itineraryId);
    setActiveTab("map");
  };

  // Generate filter description for list view
  const filterDescription = [
    activeFilters.length > 0 ? 
      `filtered by: ${activeFilters.map(f => f.charAt(0).toUpperCase() + f.slice(1)).join(', ')}` : '',
    userLocation && distanceFilter !== null ? 
      `within ${distanceFilter}km` : ''
  ].filter(Boolean).join(', ');

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="py-6">
          <DashboardControl 
            areaName={areaName}
            sortOption={sortOption}
            toggleShowFilters={toggleShowFilters}
            setSortOption={setSortOption}
          />

          <FilterSection 
            activeFilters={activeFilters}
            distanceFilter={distanceFilter}
            userLocation={userLocation}
            showFilters={showFilters}
            toggleFilter={toggleFilter}
            setDistanceFilter={setDistanceFilter}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="map">Map View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="mt-4">
              <MapViewTab
                mapData={{
                  center: userLocation ?? [51.5074, -0.1278],
                  zoom: 13,
                  locations: itinerariesData.map(itinerary => ({
                    id: itinerary.id,
                    name: itinerary.name,
                    latitude: itinerary.latitude,
                    longitude: itinerary.longitude,
                    itineraryId: itinerary.id,
                    description: itinerary.description || '',
                    placeId: '',
                    address: '',
                    price: '',
                    category: ''
                  }))
                }}
                userLocation={userLocation}
                distanceFilter={distanceFilter}
                selectedItineraryId={selectedItineraryId}
                itinerarySpots={itinerarySpots}
                handleSelectItinerary={handleSelectItinerary}
                showItineraryDetails={showItineraryDetails}
              />
            </TabsContent>
            
            <TabsContent value="list" className="mt-4">
              <ListView 
                filteredItineraries={itinerariesData}
                totalItinerariesCount={itinerariesData.length}
                selectedItineraryForDetails={selectedItineraryForDetails}
                savedItineraries={savedItineraries}
                likedItineraries={likedItineraries}
                filterDescription={filterDescription}
                setSelectedItineraryForDetails={setSelectedItineraryForDetails}
                toggleSaveItinerary={toggleSaveItinerary}
                toggleLikeItinerary={toggleLikeItinerary}
                viewItineraryOnMap={handleViewItineraryOnMap}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
} 