import { Heart, Bookmark, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "./ReviewForm";
import { ReportForm } from "./ReportForm";

type ActionButtonsProps = {
  id: string | number;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: (id: string | number) => void;
  onToggleSave: (id: string | number) => void;
  onViewOnMap?: (id: string | number) => void;
  onReviewSubmitted?: () => void;
  size?: "sm" | "icon";
  layout?: "header" | "footer";
  onReportSubmitted?: () => void;
};

const HeartIcon = ({ className = "h-4 w-4", color = "var(--primary)" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={color} 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

const BookmarkIcon = ({ className = "h-4 w-4", color = "var(--primary)" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill={color} 
    stroke={color} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
  </svg>
);

export function ActionButtons({
  id,
  isLiked,
  isSaved,
  onToggleLike,
  onToggleSave,
  onViewOnMap,
  onReviewSubmitted,
  size = "sm",
  layout = "footer",
  onReportSubmitted
}: ActionButtonsProps) {
  
  // Common handler to prevent event propagation
  const handleClick = (callback: (id: string | number) => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    callback(id);
  };

  if (layout === "header") {
    return (
      <div className="flex gap-2 items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClick(onToggleLike)}
          className="h-8 w-8 relative"
        >
          {isLiked ? (
            <HeartIcon className="h-5 w-5" />
          ) : (
            <Heart className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleClick(onToggleSave)}
          className="h-8 w-8"
        >
          {isSaved ? (
            <BookmarkIcon className="h-5 w-5" />
          ) : (
            <Bookmark className="h-5 w-5 text-muted-foreground" />
          )}
        </Button>

        <ReportForm 
          itineraryId={Number(id)}
          onReportSubmitted={onReportSubmitted}
        />
      </div>
    );
  }

  return (
    <>
      <Button 
        variant={isLiked ? "default" : "outline"} 
        size={size} 
        className="flex-1 gap-1"
        onClick={handleClick(onToggleLike)}
      >
        {isLiked ? (
          <HeartIcon color="var(--primary-foreground)" className="h-4 w-4" />
        ) : (
          <Heart className="h-4 w-4" />
        )}
        {isLiked ? 'Liked' : 'Like'}
      </Button>

      <Button 
        variant={isSaved ? "default" : "outline"} 
        size={size} 
        className="flex-1 gap-1"
        onClick={handleClick(onToggleSave)}
      >
        {isSaved ? (
          <BookmarkIcon color="var(--primary-foreground)" className="h-4 w-4" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {isSaved ? 'Saved' : 'Save'}
      </Button>

      <ReviewForm 
        itineraryId={Number(id)}
        onReviewSubmitted={onReviewSubmitted} 
      />

      {onViewOnMap && (
        <Button 
          variant="secondary" 
          size={size} 
          className="flex-1 gap-1"
          onClick={handleClick(onViewOnMap)}
        >
          <Map className="h-4 w-4" />
          <span>View on Map</span>
        </Button>
      )}
    </>
  );
} 