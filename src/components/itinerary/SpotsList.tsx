import { MapPin } from "lucide-react";
import { Spot } from "@/types";
import { categoryIcon } from "@/utils/categoryIcons";
import { capitalLetter } from "@/utils/format";

type SpotsListProps = {
  spots: Spot[];
};

export function SpotsList({ spots }: SpotsListProps) {
  if (!spots || spots.length === 0) return null;

  return (
    <div className="mt-4">
      <h4 className="text-xs font-medium mb-2">Spots:</h4>
      <ul className="space-y-2">
        {spots.map((spot, index) => {
          const spotType = spot.category;
          
          return (
            <li key={index} className="flex items-start gap-2">
              <div className="mt-0.5 rounded-md bg-muted p-1">
                {categoryIcon(spotType)}
              </div>
              <div>
                <p className="font-medium">{spot.name}</p>
                {spot.description && (
                  <p className="text-sm">{spot.description}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {capitalLetter(spotType)} 
                  {spot.price && <span> • {spot.price}</span>}
                </p>
                {spot.address && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" /> {spot.address}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 