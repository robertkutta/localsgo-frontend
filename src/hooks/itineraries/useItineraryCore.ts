import { useState } from 'react';
import { Itinerary, MapSpot, MapItinerary } from '@/types';

export const useItineraryCore = () => {
  const [itinerariesData, setItinerariesData] = useState<Itinerary[]>([]);
  const [selectedItineraryId, setSelectedItineraryId] = useState<number | null>(null);
  const [itinerarySpots, setItinerarySpots] = useState<MapSpot[]>([]);
  const [selectedItineraryForDetails, setSelectedItineraryForDetails] = useState<number | null>(null);
  const [mapData, setMapData] = useState<MapItinerary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userCreatedItineraries, setUserCreatedItineraries] = useState<Itinerary[]>([]);

  return {
    itinerariesData,
    setItinerariesData,
    selectedItineraryId,
    setSelectedItineraryId,
    itinerarySpots,
    setItinerarySpots,
    selectedItineraryForDetails,
    setSelectedItineraryForDetails,
    mapData,
    setMapData,
    isLoading,
    setIsLoading,
    userCreatedItineraries,
    setUserCreatedItineraries,
  };
}; 