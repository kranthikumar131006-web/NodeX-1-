import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  totalReviews?: number;
  className?: string;
}

export function Rating({ rating, totalReviews, className }: RatingProps) {
  const validRating = typeof rating === 'number' && !isNaN(rating) ? Math.max(0, rating) : 0;
  const fullStars = Math.floor(validRating);
  const halfStar = validRating % 1 !== 0;
  const emptyStars = Math.max(0, 5 - fullStars - (halfStar ? 1 : 0));

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && <StarHalf className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400/50 fill-yellow-400/20" />
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-muted-foreground">
          ({totalReviews} review{totalReviews !== 1 ? 's' : ''})
        </span>
      )}
    </div>
  );
}
