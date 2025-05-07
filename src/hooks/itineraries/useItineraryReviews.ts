import { useCallback } from 'react';
import { getReviewsByItineraryId, getAverageRatingByItineraryId } from '@/services/reviewService';
import { Itinerary } from '@/types';

interface UseItineraryReviewsProps {
  setItinerariesData: (updater: (prev: Itinerary[]) => Itinerary[]) => void;
}

export const useItineraryReviews = ({ setItinerariesData }: UseItineraryReviewsProps) => {
  const fetchItineraryReviews = useCallback(async (itineraryId: number) => {
    try {
      const reviews = await getReviewsByItineraryId(itineraryId);
      
      setItinerariesData(prev => 
        prev.map(itinerary => 
          itinerary.id === itineraryId 
            ? { ...itinerary, reviews } 
            : itinerary
        )
      );
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  }, [setItinerariesData]);

  const fetchItineraryAverageRating = useCallback(async (itineraryId: number) => {
    try {
      const averageRating = await getAverageRatingByItineraryId(itineraryId);
      
      setItinerariesData(prev => 
        prev.map(itinerary => 
          itinerary.id === itineraryId 
            ? { ...itinerary, averageRating: averageRating ?? undefined } 
            : itinerary
        )
      );
    } catch (error) {
      console.error('Error fetching average rating:', error);
    }
  }, [setItinerariesData]);

  return {
    fetchItineraryReviews,
    fetchItineraryAverageRating
  };
}; 