import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({
  rating = 5,
  max = 5,
  size = 'md',
  interactive = false,
  onRate = () => {},
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const iconClass = starSizes[size] || starSizes.md;

  return (
    <div className="flex items-center space-x-1">
      {[...Array(max)].map((_, i) => {
        const starValue = i + 1;
        const isFilled = interactive
          ? starValue <= (hoverRating || rating)
          : starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onRate(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${
              interactive ? 'cursor-pointer transform hover:scale-110 transition-transform' : 'cursor-default'
            } focus:outline-none`}
          >
            <Star
              className={`${iconClass} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-slate-100 text-slate-300'
              } transition-colors`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
