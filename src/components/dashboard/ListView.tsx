import { Button } from "@/components/ui/button";
import ItineraryCard from "@/components/ItineraryCard";
import { Itinerary } from "@/types";
import { SelectedItinerary } from "@/components/itinerary/SelectedItinerary";

export interface ListViewProps {
  filteredItineraries: Itinerary[];
  totalItinerariesCount: number;
  selectedItineraryForDetails: number | null;
  savedItineraries: Set<string | number>;
  likedItineraries: Set<string | number>;
  filterDescription?: string;
  setSelectedItineraryForDetails: (id: number | null) => void;
  toggleSaveItinerary: (id: number) => void;
  toggleLikeItinerary: (id: number) => void;
  viewItineraryOnMap: (id: number) => void;
}

export function ListView({
  filteredItineraries,
  totalItinerariesCount,
  selectedItineraryForDetails,
  savedItineraries,
  likedItineraries,
  filterDescription,
  setSelectedItineraryForDetails,
  toggleSaveItinerary,
  toggleLikeItinerary,
  viewItineraryOnMap,
}: ListViewProps) {
  
  const isDetailsView = selectedItineraryForDetails !== null;
  
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="col-span-full mb-4">
        <p className="text-sm text-muted-foreground">
          {isDetailsView ? (
            <Button 
              variant="link" 
              className="p-0 h-auto" 
              onClick={() => setSelectedItineraryForDetails(null)}
            >
              ← Back to all itineraries
            </Button>
          ) : (
            <>
              Showing {filteredItineraries.length} of {totalItinerariesCount} itineraries
              {filterDescription && ` (${filterDescription})`}
            </>
          )}
        </p>
      </div>
      
      {isDetailsView ? (
        <SelectedItinerary 
          itineraries={filteredItineraries}
          selectedId={selectedItineraryForDetails}
          savedItineraries={savedItineraries}
          likedItineraries={likedItineraries}
          toggleSaveItinerary={toggleSaveItinerary}
          toggleLikeItinerary={toggleLikeItinerary}
          viewItineraryOnMap={viewItineraryOnMap}
        />
      ) : (
        filteredItineraries.map(itinerary => (
          <div 
            key={itinerary.id}
            className="cursor-pointer"
            onClick={() => setSelectedItineraryForDetails(Number(itinerary.id))}
          >
            <ItineraryCard
              itinerary={itinerary}
              isSaved={savedItineraries.has(itinerary.id)}
              isLiked={likedItineraries.has(itinerary.id)}
              onToggleSave={(id) => toggleSaveItinerary(Number(id))}
              onToggleLike={(id) => toggleLikeItinerary(Number(id))}
              onViewOnMap={(id) => viewItineraryOnMap(Number(id))}
            />
          </div>
        ))
      )}
    </div>
  );
} 