import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { mapsUrl } from '@/utils/mapLinks';
import { MapSpot } from '@/types';

interface ItineraryControlsProps {
  selectedItineraryId: number | null;
  itinerarySpots: MapSpot[];
  onSelectItinerary: (itineraryId: number | null) => void;
}

const ItineraryControls = ({
  selectedItineraryId,
  itinerarySpots,
  onSelectItinerary
}: ItineraryControlsProps) => {
  if (!selectedItineraryId) return null;
  
  const hasMultipleSpots = itinerarySpots.length >= 2;
  
  return (
    <div className="absolute left-4 top-[5px] z-[1000] flex flex-col gap-2 bg-white/80 p-2 rounded-md shadow-sm">
      <Button
        size="sm"
        variant="ghost" 
        className="bg-white shadow-md hover:bg-gray-100 text-black"
        onClick={() => onSelectItinerary(null)}
      >
        ← Back to All Itineraries
      </Button>
      
      {hasMultipleSpots && (
        <a 
          href={mapsUrl(itinerarySpots)}
          target="_blank"
          rel="noopener noreferrer"
          className="no-underline"
        >
          <Button
            size="sm"
            className="w-full flex items-center gap-1"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Navigate in Google Maps
          </Button>
        </a>
      )}
    </div>
  );
}

export default ItineraryControls; 