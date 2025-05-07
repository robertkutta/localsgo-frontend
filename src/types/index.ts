export type Coordinates = [number, number];

export type SortOption = 'nearest' | 'recent' | 'popular';

export interface Spot {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  placeId: string;
  address: string;
  price: string;
  category: string;
  itineraryId: number;
}

export interface MapSpot extends Spot {
  index?: number;
}

export interface Itinerary {
  id: number;
  userId: string;
  name: string;
  description?: string;
  latitude: number;
  longitude: number;
  tripTypes: string[];
  createdAt: string;
  updatedAt: string;
  spots: Spot[];
  locations?: Spot[]; // needs to be removed
  derivedCategories: string[];
  likes: number;
  reviews?: Review[];
  averageRating?: number;
}

export interface Review {
  id: number;
  userId: string;
  itineraryId: number;
  content: string;
  rating: number;
  createdAt: string;
  itinerary?: {
    name: string;
    description?: string;
  };
}

export interface Report {
  id: number;
  userId: string;
  itineraryId: number;
  details?: string;
  reason: string;
  createdAt: string;
}

export interface MapItinerary extends Itinerary {
  color?: string;
  center?: Coordinates;
  zoom?: number;
} 

export interface MapProps {
  center: Coordinates;
  zoom: number;
  userLocation: Coordinates | null;
  locations?: Spot[];
  distanceRadius?: number; 
  onSelectItinerary?: (itineraryId: number | null) => void; 
  onShowItineraryDetails?: (itineraryId: number | null) => void; 
  selectedItineraryId?: number | null; 
  itinerarySpots?: MapSpot[]; 
  useCard?: boolean;
  showInfoBanner?: boolean;
  distanceFilter?: number | null;
  height?: string;
} 

// Interface for itinerary filters
export interface ItineraryFilters {
  activeFilters: string[];
  distanceFilter: number | null;
  sortOption: SortOption;
}


// Interface for the itinerary form state
export interface ItineraryFormData {
  name: string;
  description: string;
  tripTypes: string[];
  spots: Spot[];
}


