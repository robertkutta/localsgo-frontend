import { Card, CardContent } from "@/components/ui/card";
import dynamic from 'next/dynamic';
import { MapSpot, Coordinates, Spot } from "@/types";

// Import the map with SSR disabled
const DynamicMap = dynamic(() => import('../../components/Map'), { 
  ssr: false,
  loading: () => <p className="h-full w-full flex items-center justify-center">Loading map...</p>
});

interface MapViewData {
  center: Coordinates;
  zoom: number;
  locations: Spot[];
}

interface MapViewTabProps {
  mapData: MapViewData;
  userLocation: [number, number] | null;
  distanceFilter: number | null;
  selectedItineraryId: number | null;
  itinerarySpots: MapSpot[];
  handleSelectItinerary: (itineraryId: number | null) => void;
  showItineraryDetails: (itineraryId: number | null) => void;
}

export function MapViewTab({
  mapData,
  userLocation,
  distanceFilter,
  selectedItineraryId,
  itinerarySpots,
  handleSelectItinerary,
  showItineraryDetails
}: MapViewTabProps) {
  const hasValidCenter = mapData?.center && Array.isArray(mapData.center) && mapData.center.length === 2;
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="relative h-[500px] w-full rounded-md overflow-hidden">
          {hasValidCenter && (
            <>
              <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 1000 }} className="bg-white/80 px-2 py-1 rounded text-sm">
                {userLocation && (
                  <>
                    {distanceFilter !== null ? `Within ${distanceFilter}km` : 'All locations'}
                  </>
                )}
                {selectedItineraryId && (
                  <span>{userLocation ? ' • ' : ''}Viewing selected itinerary</span>
                )}
              </div>
              <DynamicMap 
                center={mapData.center}
                zoom={mapData.zoom ?? 13}
                userLocation={userLocation}
                locations={mapData.locations}
                distanceRadius={userLocation && distanceFilter ? distanceFilter * 1000 : undefined} 
                onSelectItinerary={handleSelectItinerary}
                onShowItineraryDetails={showItineraryDetails}
                selectedItineraryId={selectedItineraryId}
                itinerarySpots={itinerarySpots}
              />
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 