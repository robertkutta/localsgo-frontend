import { Marker, Popup } from 'react-leaflet';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markerIcon } from '@/utils/mapIcons';
import { Spot } from '@/types';
import { categoryIcon } from '@/utils/categoryIcons';

interface LocationMark {
  location: Spot;
  index: number;
  onSelectItinerary?: (itineraryId: number | null) => void;
  onShowItineraryDetails?: (itineraryId: number | null) => void;
}

const LocationMarker = ({ 
  location, 
  index,
  onSelectItinerary,
  onShowItineraryDetails 
}: LocationMark) => {
  if (!location.latitude || !location.longitude) {
    return null;
  }
  
  return (
    <Marker
      key={`marker-${location.id || index}-${location.latitude}-${location.longitude}`}
      position={[location.latitude, location.longitude]}
      icon={markerIcon}
    >
      <Popup>
        <div className="min-w-[200px] max-w-[280px]">
          <div className="bg-primary/10 p-2 rounded-t-md">
            <h3 className="font-semibold text-sm">{location.name}</h3>
          </div>
          <div className="p-3 space-y-2">
            {location.category && (
              <div className="flex flex-wrap gap-1 mb-1">
                {location.category.split(',').map((category, idx) => {
                  const trimmedCategory = category.trim();
                  const typeLower = trimmedCategory.toLowerCase();
                  const hasCategory = location.category === typeLower;
                  
                  return (
                    <Badge 
                      key={idx} 
                      variant={hasCategory ? "outline" : "secondary"} 
                      className="flex items-center gap-1 text-xs"
                    >
                      {hasCategory && categoryIcon(typeLower)}
                      {trimmedCategory.charAt(0).toUpperCase() + trimmedCategory.slice(1)}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {location.description && (
              <p className="text-xs text-muted-foreground">{location.description}</p>
            )}
            
            {location.price && (
              <p className="text-xs flex items-center gap-1">
                <span className="font-medium">Details:</span> {location.price}
              </p>
            )}
            
            <div className="pt-2 flex flex-col gap-1.5">
              {onShowItineraryDetails && location.itineraryId && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2 py-0 w-full text-muted-foreground" 
                  onClick={() => onShowItineraryDetails(location.itineraryId)}
                >
                  View Details
                </Button>
              )}
              
              {onSelectItinerary && location.itineraryId && (
                <Button
                  size="sm"
                  className="mt-1 text-xs h-6 px-2 py-0" 
                  onClick={() => onSelectItinerary(location.itineraryId)}
                >
                  Show Itinerary Spots
                </Button>
              )}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default LocationMarker; 