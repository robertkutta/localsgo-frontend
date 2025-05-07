import { Marker, Popup } from 'react-leaflet';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { numberIcon } from '@/utils/mapIcons';
import { singleSpotUrl } from '@/utils/mapLinks';
import { MapSpot } from '@/types';
import { categoryIcon } from '@/utils/categoryIcons';
import { capitalLetter } from '@/utils/format';

interface SpotMark {
  spot: MapSpot;
  index: number;
  onShowItineraryDetails?: (itineraryId: number | null) => void;
}

const SpotMarker = ({ 
  spot, 
  index,
  onShowItineraryDetails 
}: SpotMark) => {
  const displayIndex = spot.index ?? index;
  
  return (
    <Marker
      position={[spot.latitude, spot.longitude]}
      icon={numberIcon(displayIndex)}
    >
      <Popup>
        <div className="min-w-[220px] max-w-[280px]">
          <div className="bg-primary/10 p-2 rounded-t-md flex items-center gap-2">
            <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
              {displayIndex}
            </div>
            <h3 className="font-semibold text-sm">{spot.name}</h3>
          </div>
          
          <div className="p-3 space-y-2">
            {spot.category && (
              <Badge variant="outline" className="flex items-center gap-1 text-xs mb-1">
                {categoryIcon(spot.category)}
                {capitalLetter(spot.category)}
              </Badge>
            )}
            
            {spot.description && (
              <p className="text-xs text-muted-foreground">{spot.description}</p>
            )}
            
            {spot.price && (
              <div className="bg-muted/50 rounded p-1.5 text-xs">
                <span className="font-medium">Price Range:</span> {spot.price}
              </div>
            )}
            
            <div className="pt-2 space-y-1.5">
              {spot.itineraryId && onShowItineraryDetails && (
                <Button 
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs px-2 py-0 w-full text-muted-foreground" 
                  onClick={() => onShowItineraryDetails(spot.itineraryId)}
                >
                  View Full Itinerary
                </Button>
              )}
              <a 
                href={singleSpotUrl(spot.latitude, spot.longitude)}
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
              >
                <ExternalLink className="h-3 w-3" /> Navigate to this spot
              </a>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default SpotMarker; 