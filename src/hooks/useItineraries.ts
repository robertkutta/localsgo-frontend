import { useCallback } from 'react';
import { ItineraryFilters } from '@/types';
import { useItineraryCore } from './itineraries/useItineraryCore';
import { useItineraryInteractions } from './itineraries/useItineraryInteractions';
import { useItineraryFilters } from './itineraries/useItineraryFilters';
import { useItineraryReviews } from './itineraries/useItineraryReviews';
import { 
  deleteItinerary as deleteItineraryService,
  getAllItineraries,
  getUserCreatedItineraries,
  getItinerarySpots
} from '@/services/itineraryService';

interface UseItinerariesProps {
  userId: string;
  authToken?: string;
}

const useItineraries = ({ userId, authToken }: UseItinerariesProps) => {
  const {
    itinerariesData,
    setItinerariesData,
    selectedItineraryId,
    setSelectedItineraryId,
    itinerarySpots,
    setItinerarySpots,
    selectedItineraryForDetails,
    setSelectedItineraryForDetails,
    isLoading,
    setIsLoading,
    userCreatedItineraries,
    setUserCreatedItineraries,
  } = useItineraryCore();

  const {
    savedItineraries,
    likedItineraries,
    fetchUserInteractions,
    toggleSaveItinerary,
    toggleLikeItinerary,
  } = useItineraryInteractions({ userId, authToken });

  const {
    fetchItineraries,
    fetchFilteredItineraries,
  } = useItineraryFilters({
    setItinerariesData,
    setIsLoading,
    fetchUserInteractions,
  });

  const {
    fetchItineraryReviews,
    fetchItineraryAverageRating,
  } = useItineraryReviews({
    setItinerariesData,
  });

  // Function to fetch all itineraries without filtering
  const fetchAllItineraries = useCallback(async () => {
    try {
      const data = await getAllItineraries();
      setItinerariesData(data);
      return data;
    } catch (error) {
      console.error('Error fetching all itineraries:', error);
      throw error;
    }
  }, [setItinerariesData]);

  // Function to fetch user's created itineraries
  const fetchUserCreatedItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUserCreatedItineraries(userId, authToken);
      setItinerariesData(data);
      await fetchUserInteractions();
    } catch (error) {
      console.error('Error fetching user created itineraries:', error);
      setItinerariesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, authToken, setItinerariesData, setIsLoading, fetchUserInteractions]);

  // Function to fetch saved itineraries
  const fetchSavedItineraries = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchAllItineraries();
      if (userId) {
        await fetchUserInteractions();
      }
    } catch (error) {
      console.error('Error fetching saved itineraries:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchAllItineraries, fetchUserInteractions, userId, setIsLoading]);

  // Function to handle selecting an itinerary and loading its spots
  const handleSelectItinerary = useCallback(async (itineraryId: number | null) => {
    setSelectedItineraryId(itineraryId);
    
    if (itineraryId === null) {
      setItinerarySpots([]);
      return;
    }
    
    try {
      const spotsData = await getItinerarySpots(itineraryId);
      setItinerarySpots(spotsData);
    } catch (error) {
      console.error('Error fetching itinerary spots:', error);
      setItinerarySpots([]);
    }
  }, [setSelectedItineraryId, setItinerarySpots]);

  const deleteItinerary = useCallback(async (itineraryId: number) => {
    if (!authToken) {
      console.error('Authentication required to delete itineraries');
      return;
    }
    
    setIsLoading(true);
    try {
      await deleteItineraryService(itineraryId, authToken);
      
      setItinerariesData(prev => prev.filter(item => item.id !== itineraryId));
      
      if (window.location.pathname.includes('/dashboard/userItineraries')) {
        await fetchUserCreatedItineraries();
      }
    } catch (error) {
      console.error('Error deleting itinerary:', error);
      setItinerariesData(prev => prev.filter(item => item.id !== itineraryId));
    } finally {
      setIsLoading(false);
    }
  }, [authToken, setItinerariesData, setIsLoading, fetchUserCreatedItineraries]);

  return {
    // State
    itinerariesData,
    savedItineraries,
    likedItineraries,
    selectedItineraryId,
    itinerarySpots,
    selectedItineraryForDetails,
    isLoading,
    userCreatedItineraries,

    // Actions
    fetchItineraries,
    fetchSavedItineraries,
    fetchAllItineraries,
    fetchFilteredItineraries,
    handleSelectItinerary,
    toggleSaveItinerary,
    toggleLikeItinerary,
    setSelectedItineraryForDetails,
    fetchUserCreatedItineraries,
    setUserCreatedItineraries,
    fetchItineraryReviews,
    fetchItineraryAverageRating,
    deleteItinerary,
  };
};

export default useItineraries;
export type { ItineraryFilters }; 