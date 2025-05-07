import ItineraryCard from "@/components/ItineraryCard";
import { Itinerary } from "@/types";

export function SelectedItinerary({
  itineraries,
  selectedId,
  savedItineraries,
  likedItineraries,
  toggleSaveItinerary,
  toggleLikeItinerary,
  viewItineraryOnMap,
}: {
  itineraries: Itinerary[];
  selectedId: number | null;
  savedItineraries: Set<number | string>;
  likedItineraries: Set<number | string>;
  toggleSaveItinerary: (id: number) => void;
  toggleLikeItinerary: (id: number) => void;
  viewItineraryOnMap: (id: number) => void;
}) {
  // Find the selected itinerary
  const itinerary = itineraries.find(i => i.id === selectedId);
  if (!itinerary) return null;

  return (
    <div className="w-full max-w-lg mx-auto h-full overflow-y-auto">
      <ItineraryCard
        itinerary={itinerary}
        isSaved={savedItineraries.has(itinerary.id)}
        isLiked={likedItineraries.has(itinerary.id)}
        onToggleSave={(id) => toggleSaveItinerary(Number(id))}
        onToggleLike={(id) => toggleLikeItinerary(Number(id))}
        onViewOnMap={(id) => viewItineraryOnMap(Number(id))}
      />
    </div>
  );
} 