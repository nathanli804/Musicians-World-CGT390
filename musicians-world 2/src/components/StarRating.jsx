export default function StarRating({ rating, count }) {
  const percent = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className="star-rating" aria-label={`Rated ${rating} out of 5 from ${count} reviews`}>
      <span className="stars" aria-hidden="true">
        <span className="stars-base">★★★★★</span>
        <span className="stars-fill" style={{ width: `${percent}%` }}>
          ★★★★★
        </span>
      </span>
      <span className="rating-value" aria-hidden="true">
        {rating.toFixed(1)}
      </span>
      <span className="rating-count" aria-hidden="true">
        ({count})
      </span>
    </div>
  );
}
