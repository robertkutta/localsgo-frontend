import { useState, useCallback } from 'react';
import { 
  getUserSavedItineraries, 
  getUserLikedItineraries, 
  toggleSaveItinerary as toggleSaveItineraryService,
  toggleLikeItinerary as toggleLikeItineraryService
} from '@/services/itineraryService';

interface UseItineraryInteractionsProps {
  userId: string;
  authToken?: string;
}

export const useItineraryInteractions = ({ userId, authToken }: UseItineraryInteractionsProps) => {
  const [savedItineraries, setSavedItineraries] = useState<Set<number>>(new Set());
  const [likedItineraries, setLikedItineraries] = useState<Set<number>>(new Set());

  const fetchUserInteractions = useCallback(async () => {
    if (!userId) return;
    
    try {
      const savedData = await getUserSavedItineraries(userId, authToken);
      setSavedItineraries(new Set(savedData.map(item => item.itineraryId)));
      
      const likedData = await getUserLikedItineraries(userId, authToken);
      setLikedItineraries(new Set(likedData.map(item => item.itineraryId)));
    } catch (error) {
      console.error('Error fetching user interactions:', error);
    }
  }, [userId, authToken]);

  const toggleSaveItinerary = useCallback(async (itineraryId: number) => {
    try {
      if (!authToken?.trim()) return;
      
      await toggleSaveItineraryService(userId, itineraryId, authToken);
      await fetchUserInteractions();
    } catch (error) {
      console.error('Error toggling save status:', error);
    }
  }, [userId, authToken, fetchUserInteractions]);

  const toggleLikeItinerary = useCallback(async (itineraryId: number) => {
    try {
      if (!authToken?.trim()) return;
      
      await toggleLikeItineraryService(userId, itineraryId, authToken);
      await fetchUserInteractions();
    } catch (error) {
      console.error('Error toggling like status:', error);
    }
  }, [userId, authToken, fetchUserInteractions]);

  return {
    savedItineraries,
    likedItineraries,
    fetchUserInteractions,
    toggleSaveItinerary,
    toggleLikeItinerary,
  };
}; 