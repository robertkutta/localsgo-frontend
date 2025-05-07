'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useAuth } from '@clerk/nextjs';
import { getReviewsForUserItineraries } from '@/services/reviewService';
import { Review } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { format } from 'date-fns';

export default function ReviewsPage() {
  const router = useRouter();
  const { userId } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    async function fetchReviews() {
      if (!userId) return;
      
      try {
        const reviewsData = await getReviewsForUserItineraries(userId);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchReviews();
  }, [userId]);
  
  const renderStars = (rating: number) => (
    Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'fill-primary text-primary' : 'text-gray-200'}`} 
      />
    ))
  );
  
  const renderReviewCards = () => (
    reviews.map((review) => (
      <Card key={review.id}>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{review.itinerary?.name || 'Untitled Itinerary'}</CardTitle>
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(review.createdAt), 'MMMM d, yyyy')}
          </div>
        </CardHeader>
        <CardContent>
          <p>{review.content}</p>
        </CardContent>
      </Card>
    ))
  );
  
  const renderEmptyState = () => (
    <div className="col-span-full py-8 text-center">
      <p>No reviews yet.</p>
      <p className="mt-2">Create an itinerary and wait for other users to review it.</p>
      <Button 
        className="mt-4"
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </Button>
    </div>
  );
  
  return (
    <div className="container py-6 px-4">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">My Reviews</h2>
        <p className="text-muted-foreground">View all your itinerary reviews in one place</p>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.length > 0 ? renderReviewCards() : renderEmptyState()}
        </div>
      )}
    </div>
  );
} 