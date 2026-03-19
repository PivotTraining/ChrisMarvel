import { Star } from 'lucide-react';

export default function StarRating({ value = 0, onChange, size = 24 }) {
  return (
    <div className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          className="cursor-pointer transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50 rounded"
          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
        >
          <Star
            size={size}
            className={
              star <= value
                ? 'fill-accent-primary text-accent-primary'
                : 'fill-transparent text-text-muted'
            }
          />
        </button>
      ))}
    </div>
  );
}
