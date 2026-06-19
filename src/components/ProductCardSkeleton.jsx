const ProductCardSkeleton = () => (
  <div
    className="w-full rounded-2xl overflow-hidden animate-pulse"
    style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid #EDE5D8' }}
  >
    <div className="h-44 sm:h-52 md:h-56 shimmer" />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-4 rounded-lg w-3/4 shimmer" />
      <div className="h-3 rounded-lg w-full shimmer" />
      <div className="h-3 rounded-lg w-1/2 shimmer" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-3 rounded w-10 shimmer" />
        <div className="h-5 rounded w-14 shimmer" />
      </div>
      <div className="h-9 rounded-xl shimmer" />
    </div>
  </div>
);

export default ProductCardSkeleton;
