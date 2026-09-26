import { FaStar } from "react-icons/fa";

/**
 * Renders a 0-5 rating using filled / half / empty stars, matching the
 * thresholds the original PHP template used.
 */
export function RatingStars({
  rating,
  className = "",
}: {
  rating: number;
  className?: string;
}) {
  const stars = Array.from({ length: 5 }, (_, index) => {
    if (rating >= index + 0.8) return "full";
    if (rating >= index + 0.3) return "half";
    return "empty";
  });

  return (
    <span className={`inline-flex items-center gap-1 text-brand ${className}`} title={rating.toFixed(1)}>
      {stars.map((state, index) => (
        <FaStar
          key={index}
          aria-hidden
          className={`text-sm ${state === "empty" ? "text-line" : ""}`}
          style={state === "half" ? { clipPath: "inset(0 50% 0 0)" } : undefined}
        />
      ))}
      <span className="sr-only">{rating.toFixed(1)} out of 5</span>
    </span>
  );
}
