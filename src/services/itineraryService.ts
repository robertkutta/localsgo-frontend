import { ItineraryFormData } from "@/hooks/useItineraryForm"
import { Spot, Itinerary, ItineraryFilters, Coordinates } from "@/types"
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'


async function apiRequest<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error status:', response.status);
    console.error('Error response body:', errorText);
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  if (options?.method === 'DELETE' || response.headers.get('content-length') === '0') {
    return {} as T;
  }
  return await response.json();
}

interface SubmitItineraryRequest {
  userId: string
  name: string
  description: string
  latitude: number
  longitude: number
  tripTypes: string[]
  spots: {
    name: string
    description: string
    category: string
    price?: string
    address?: string
    placeId?: string
    latitude?: number
    longitude?: number
  }[]
}

export const submitItinerary = async (formData: ItineraryFormData, userId: string, authToken: string) => {
  // Find a spot with location data to use as the itinerary location
  const spotWithLocation = formData.spots.find((spot) => spot.latitude && spot.longitude)
  if (!spotWithLocation) {
    throw new Error("Please add at least one location with coordinates")
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  headers.Authorization = `Bearer ${authToken || ''}`
  
  const payload: SubmitItineraryRequest = {
    userId,
    name: formData.name,
    description: formData.description || "",
    latitude: spotWithLocation.latitude!,
    longitude: spotWithLocation.longitude!,
    tripTypes: formData.tripTypes,
    // Convert UI spots to API spots format
    spots: formData.spots.map((spot: Spot) => ({
      name: spot.name,
      description: spot.description || "",
      category: spot.category || "",
      price: spot.price,
      address: spot.address,
      placeId: spot.placeId,
      latitude: spot.latitude,
      longitude: spot.longitude
    }))
  }
  
  return apiRequest<Itinerary>('/api/itinerary', {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  });
}

export const deleteItinerary = async (itineraryId: number, authToken: string) => {
  return apiRequest<boolean>(`/api/itinerary/${itineraryId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken || ''}`
    }
  });
}


export const getAllItineraries = async (): Promise<Itinerary[]> => {
  return apiRequest<Itinerary[]>('/api/itinerary');
}

export const getUserCreatedItineraries = async (userId: string, authToken?: string): Promise<Itinerary[]> => {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return apiRequest<Itinerary[]>(`/api/itinerary/user/${userId}`, { headers });
}

export const getFilteredItineraries = async (
  filters: ItineraryFilters, 
  userLocation: Coordinates | null
): Promise<Itinerary[]> => {
  const queryParams = buildQueryParams(filters, userLocation);
  const endpoint = `/api/itinerary/filter-sort${queryParams.length > 0 ? `?${queryParams.join('&')}` : ''}`;
  
  return apiRequest<Itinerary[]>(endpoint);
}

export const getItinerarySpots = async (itineraryId: number): Promise<Spot[]> => {
  return apiRequest<Spot[]>(`/api/itinerary/${itineraryId}/spots`);
}

export const getUserSavedItineraries = async (userId: string, authToken?: string): Promise<{itineraryId: number}[]> => {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return apiRequest<{itineraryId: number}[]>(`/api/save/user/${userId}`, { headers });
}

export const getUserLikedItineraries = async (userId: string, authToken?: string): Promise<{itineraryId: number}[]> => {
  const headers: Record<string, string> = {};
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return apiRequest<{itineraryId: number}[]>(`/api/like/user/${userId}`, { headers });
}

export const toggleSaveItinerary = async (userId: string, itineraryId: number, authToken: string): Promise<void> => {
  return apiRequest<void>(`/api/save/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ userId, itineraryId })
  });
}

export const toggleLikeItinerary = async (userId: string, itineraryId: number, authToken: string): Promise<void> => {
  return apiRequest<void>(`/api/like/toggle`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({ userId, itineraryId })
  });
}

function buildQueryParams(filters: ItineraryFilters, userLocation: Coordinates | null): string[] {
  const queryParams = [];
  
  if (filters.activeFilters?.length > 0) {
    const tripTypes = ['business', 'leisure', 'active', 'family', 'couples'];
    const categories = ['coffee', 'restaurant', 'entertainment', 'nightlife', 'gym', 'shopping', 'cultural', 'outdoor'];
    
    const tripTypeValues = filters.activeFilters.filter(f => tripTypes.includes(f));
    const categoryValues = filters.activeFilters.filter(f => categories.includes(f));
    
    if (categoryValues.length > 0) {
      queryParams.push(`derivedCategories=${categoryValues.join(',')}`);
    }
    
    if (tripTypeValues.length > 0) {
      queryParams.push(`tripTypes=${tripTypeValues.join(',')}`);
    }
  }

  if (userLocation) {
    const [lat, lng] = userLocation;
    
    if (filters.distanceFilter !== null) {
      const distance = filters.distanceFilter;
      queryParams.push(`latitude=${lat}`);
      queryParams.push(`longitude=${lng}`);
      queryParams.push(`distanceKm=${distance}`);
    } else if (filters.sortOption === 'nearest') {
      queryParams.push(`latitude=${lat}`);
      queryParams.push(`longitude=${lng}`);
    }
  }
  
  if (filters.sortOption) {
    queryParams.push(`sortOption=${filters.sortOption}`);
  }
  
  return queryParams;
} 