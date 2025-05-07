import { useCallback, useRef } from 'react';
import { ItineraryFilters, Coordinates, Itinerary } from '@/types';
import { getFilteredItineraries } from '@/services/itineraryService';

interface UseItineraryFiltersProps {
  setItinerariesData: (data: Itinerary[]) => void;
  setIsLoading: (loading: boolean) => void;
  fetchUserInteractions?: () => Promise<void>;
}

export const useItineraryFilters = ({ 
  setItinerariesData, 
  setIsLoading,
  fetchUserInteractions 
}: UseItineraryFiltersProps) => {
  // Add a reference for the request ID to implement request cancellation
  const activeRequestRef = useRef<number>(0);

  const fetchFilteredItineraries = useCallback(async (filters: ItineraryFilters, userLocation: Coordinates | null) => {
    try {
      // Generate unique request ID
      const currentRequestId = activeRequestRef.current + 1;
      activeRequestRef.current = currentRequestId;
      
      const data = await getFilteredItineraries(filters, userLocation);
      
      // If this is not the latest request, ignore the result
      if (activeRequestRef.current !== currentRequestId) {
        return [];
      }
      
      setItinerariesData(data);

      if (fetchUserInteractions) {
        await fetchUserInteractions();
      }

      return data;
    } catch (error) {
      console.error('Error fetching filtered itineraries:', error);
      throw error;
    }
  }, [setItinerariesData, fetchUserInteractions]);

  const fetchItineraries = useCallback(async (filters: ItineraryFilters, userLocation: Coordinates | null) => {
    setIsLoading(true);
    try {
      await fetchFilteredItineraries(filters, userLocation);
    } catch (error) {
      console.error('Error in fetchItineraries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFilteredItineraries, setIsLoading]);

  return {
    fetchItineraries,
    fetchFilteredItineraries,
  };
}; 