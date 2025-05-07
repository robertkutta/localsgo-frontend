'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { createReview } from '@/services/reviewService';
import { toast } from 'sonner';
import { useAuth } from '@clerk/nextjs';
import { Star } from 'lucide-react';
import useAuthToken from '@/hooks/useAuth';

export function ReviewForm({ itineraryId, onReviewSubmitted }: { 
  itineraryId: number; 
  onReviewSubmitted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const { authToken } = useAuthToken();
  
  const handleSubmit = async () => {
    if (!userId) {
      toast.error('Authentication required', {
        description: 'Please sign in to leave a review'
      });
      return;
    }

    if (rating === 0) {
      toast.error('Rating required', {
        description: 'Please select a rating from 1-5 stars'
      });
      return;
    }

    if (!content.trim()) {
      toast.error('Review content required', {
        description: 'Please enter your review'
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createReview({
        userId,
        itineraryId,
        content,
        rating,
      }, authToken);
      
      toast.success('Review submitted', {
        description: 'Thank you for your feedback!'
      });
      
      setContent('');
      setRating(0);
      setOpen(false);
      
      onReviewSubmitted?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please try again later'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => (
    <div className="flex justify-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none"
        >
          <Star 
            className={`h-8 w-8 ${rating >= star 
              ? 'fill-primary text-primary' 
              : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog 
      open={open} 
      onOpenChange={(value) => {
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex-1 gap-1" 
          onClick={(e) => e.stopPropagation()}
        >
          <Star className="h-4 w-4" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {renderStars()}
          
          <Textarea
            placeholder="Share your experience with this itinerary..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
          />
          
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
