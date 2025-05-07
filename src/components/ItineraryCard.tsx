import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Itinerary } from "@/types"
import { ActionButtons } from "./itinerary/ActionButtons"
import { ItineraryDetails } from "./itinerary/ItineraryDetails"
import { SpotsList } from "./itinerary/SpotsList"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Star } from "lucide-react"
import { getReviewsByItineraryId } from "@/services/reviewService"
import { Review } from "@/types"

export default function ItineraryCard({ 
  itinerary, 
  isSaved, 
  isLiked, 
  onToggleSave, 
  onToggleLike,
  onViewOnMap,
  onReviewSubmitted,
  onReportSubmitted
}: { 
  itinerary: Itinerary; 
  isSaved: boolean; 
  isLiked: boolean; 
  onToggleSave: (id: string | number) => void; 
  onToggleLike: (id: string | number) => void;
  onViewOnMap?: (id: string | number) => void;
  onReviewSubmitted?: () => void;
  onReportSubmitted?: () => void;
}) {
  const [reviewsModalOpen, setReviewsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Calculate average rating
  const averageRating = itinerary.averageRating || 
    (itinerary.reviews && itinerary.reviews.length > 0 
      ? itinerary.reviews.reduce((acc, review) => acc + review.rating, 0) / itinerary.reviews.length 
      : undefined);
      
  const actionButtonProps = {
    id: itinerary.id,
    isLiked,
    isSaved,
    onToggleLike,
    onToggleSave,
    onReportSubmitted,
  };

  // Load reviews when opening the modal
  const handleOpenReviewsModal = async () => {
    setReviewsModalOpen(true);
    setLoading(true);
    
    try {
      const data = await getReviewsByItineraryId(itinerary.id);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <CardTitle className="text-xl">{itinerary.name}</CardTitle>
              {averageRating && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenReviewsModal();
                  }}
                  className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary hover:underline transition-colors w-fit"
                  aria-label="View all reviews"
                >
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span>{averageRating.toFixed(1)}</span>
                </button>
              )}
            </div>
            <ActionButtons 
              {...actionButtonProps}
              layout="header"
            />
          </div>
        </CardHeader>
        
        <CardContent className="flex-grow">
          <ItineraryDetails itinerary={itinerary} />
          <SpotsList spots={itinerary.spots || []} />
        </CardContent>
        
        <Separator />
        
        <CardFooter className="pt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
          <ActionButtons 
            {...actionButtonProps}
            onViewOnMap={onViewOnMap}
            onReviewSubmitted={() => {
              onReviewSubmitted?.();
              handleOpenReviewsModal();
            }}
          />
        </CardFooter>
      </Card>
      
      {/* Inline reviews modal */}
      <Dialog open={reviewsModalOpen} onOpenChange={setReviewsModalOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reviews</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center py-8">Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">No reviews yet for this itinerary.</div>
          ) : (
            <div className="space-y-4 py-2">
              {reviews.map((review) => (
                <div key={review.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${review.rating >= star 
                            ? 'fill-primary text-primary' 
                            : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm">{review.content}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 