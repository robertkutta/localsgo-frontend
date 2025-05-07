import { Badge } from "@/components/ui/badge";
import { Itinerary } from "@/types";
import { categoryIcon } from "@/utils/categoryIcons";
import { capitalLetter } from "@/utils/format";

type ItineraryDetailsProps = {
  itinerary: Itinerary;
};

export function ItineraryDetails({ itinerary }: ItineraryDetailsProps) {
  // Use derivedCategories from itinerary if available, otherwise extract from spots
  const categories = itinerary.derivedCategories || 
    [...new Set((itinerary.spots || [])
      .map(spot => spot.category)
      .filter(Boolean) as string[])];

  return (
    <div className="space-y-3">
      {itinerary.description && (
        <p className="text-muted-foreground mb-4">{itinerary.description}</p>
      )}
      
      {itinerary.tripTypes?.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-2">Trip Types:</h4>
          <div className="flex flex-wrap gap-2">
            {itinerary.tripTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {capitalLetter(type)}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {categories.length > 0 && (
        <div>
          <h4 className="text-xs font-medium mb-2">Categories:</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {categoryIcon(category)}
                {capitalLetter(category)}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 