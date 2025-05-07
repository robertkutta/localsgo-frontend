import React from 'react';
import { 
  Coffee, 
  Utensils, 
  Music, 
  Umbrella,
  Wine, 
  Dumbbell, 
  ShoppingBag, 
  Landmark as LandmarkIcon, 
  TreePine, 
  MapPin 
} from "lucide-react";

// Define icons with their correct sizes upfront
const icons = {
  coffee: <Coffee className="h-3 w-3" />,
  restaurant: <Utensils className="h-3 w-3" />,
  entertainment: <Music className="h-3 w-3" />,
  leisure: <Umbrella className="h-3 w-3" />,
  nightlife: <Wine className="h-3 w-3" />,
  gym: <Dumbbell className="h-3 w-3" />,
  shopping: <ShoppingBag className="h-3 w-3" />,
  cultural: <LandmarkIcon className="h-3 w-3" />,
  outdoor: <TreePine className="h-3 w-3" />,
  default: <MapPin className="h-3 w-3" />
};

// Large icons for the UI
export const categories = [
  { id: "coffee", label: "Coffee", icon: <Coffee className="h-4 w-4" /> },
  { id: "restaurant", label: "Restaurant", icon: <Utensils className="h-4 w-4" /> },
  { id: "entertainment", label: "Entertainment", icon: <Music className="h-4 w-4" /> },
  { id: "leisure", label: "Leisure", icon: <Umbrella className="h-4 w-4" /> },
  { id: "nightlife", label: "Nightlife", icon: <Wine className="h-4 w-4" /> },
  { id: "gym", label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
  { id: "shopping", label: "Shopping", icon: <ShoppingBag className="h-4 w-4" /> },
  { id: "cultural", label: "Cultural", icon: <LandmarkIcon className="h-4 w-4" /> },
  { id: "outdoor", label: "Outdoor", icon: <TreePine className="h-4 w-4" /> },
];

export function categoryIcon(type: string): React.ReactNode {
  if (!type) return icons.default;
  
  const typeLower = type.trim().toLowerCase();
  
  // Direct lookup from the icons object
  return icons[typeLower as keyof typeof icons] || icons.default;
}

// We're moving tripTypes to its own file

