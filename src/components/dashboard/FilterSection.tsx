import { Coffee, Utensils, Music, Wine, Dumbbell, ShoppingBag, LandmarkIcon, TreePine, Ruler } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Coordinates } from "@/types";
import { LucideIcon } from "lucide-react";

export interface FilterSectionProps {
  activeFilters: string[];
  distanceFilter: number | null;
  userLocation: Coordinates | null;
  showFilters: boolean;
  toggleFilter: (filter: string) => void;
  setDistanceFilter: (distance: number | null) => void;
}

type FilterBadgeProps = {
  active: boolean;
  onClick: () => void;
  icon?: LucideIcon;
  label: string;
};

const FilterBadge = ({ active, onClick, icon: Icon, label }: FilterBadgeProps) => (
  <Badge
    variant={active ? "default" : "outline"}
    className="cursor-pointer"
    onClick={onClick}
  >
    {Icon && <Icon className="mr-1 h-3 w-3" />} {label}
  </Badge>
);

type DistanceBadgeProps = {
  active: boolean;
  onClick: () => void;
  label: string;
};

const DistanceBadge = ({ active, onClick, label }: DistanceBadgeProps) => (
  <Badge
    variant={active ? "default" : "outline"}
    className="cursor-pointer"
    onClick={onClick}
  >
    {label}
  </Badge>
);

export function FilterSection({
  activeFilters,
  distanceFilter,
  userLocation,
  showFilters,
  toggleFilter,
  setDistanceFilter
}: FilterSectionProps) {
  if (!showFilters) return null;
  
  // Activity type filters
  const activityFilters = [
    { filter: "business", label: "Business" },
    { filter: "leisure", label: "Leisure" },
    { filter: "active", label: "Active" },
    { filter: "family", label: "Family" },
    { filter: "couples", label: "Couples" },
  ];
  
  // Location type filters with icons
  const locationFilters = [
    { filter: "coffee", label: "Coffee", icon: Coffee },
    { filter: "restaurant", label: "Restaurant", icon: Utensils },
    { filter: "entertainment", label: "Entertainment", icon: Music },
    { filter: "nightlife", label: "Nightlife", icon: Wine },
    { filter: "gym", label: "Gym", icon: Dumbbell },
    { filter: "shopping", label: "Shopping", icon: ShoppingBag },
    { filter: "cultural", label: "Cultural", icon: LandmarkIcon },
    { filter: "outdoor", label: "Outdoor", icon: TreePine },
  ];
  
  // Distance options
  const distanceOptions = [
    { value: null, label: "All" },
    { value: 1, label: "1km" },
    { value: 5, label: "5km" },
    { value: 10, label: "10km" },
    { value: 25, label: "25km" },
    { value: 50, label: "50km" },
    { value: 100, label: "100km" },
  ];
  
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {activityFilters.map(({ filter, label }) => (
          <FilterBadge
            key={filter}
            active={activeFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
            label={label}
          />
        ))}
        
        <Separator orientation="vertical" className="mx-2 h-6" />
        
        {locationFilters.map(({ filter, label, icon }) => (
          <FilterBadge
            key={filter}
            active={activeFilters.includes(filter)}
            onClick={() => toggleFilter(filter)}
            icon={icon}
            label={label}
          />
        ))}
      </div>
      
      {/* Distance filter section */}
      {userLocation && (
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <Ruler className="h-4 w-4" /> Distance
          </h4>
          <div className="flex flex-wrap gap-2">
            {distanceOptions.map(({ value, label }) => (
              <DistanceBadge
                key={label}
                active={distanceFilter === value}
                onClick={() => setDistanceFilter(value)}
                label={label}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
} 