export function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating);

  return (
    <span
      className="text-sm tracking-widest text-rose"
      aria-label={`${rating} out of 5`}
    >
      <span aria-hidden="true">
        {"\u2605".repeat(rounded)}
        <span className="text-linen-dark">{"\u2605".repeat(5 - rounded)}</span>
      </span>
    </span>
  );
}
