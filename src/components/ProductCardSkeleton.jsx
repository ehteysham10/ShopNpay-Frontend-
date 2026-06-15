const ProductCardSkeleton = () => (
  <div className="w-full bg-white dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-36 sm:h-44 md:h-52 bg-slate-100 dark:bg-slate-700/50 shimmer" />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-3/4 shimmer" />
      <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-full shimmer" />
      <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg w-1/2 shimmer" />
      <div className="flex justify-between items-center pt-1">
        <div className="h-3 bg-slate-100 dark:bg-slate-700/50 rounded w-10 shimmer" />
        <div className="h-5 bg-slate-100 dark:bg-slate-700/50 rounded w-14 shimmer" />
      </div>
      <div className="h-9 bg-slate-100 dark:bg-slate-700/50 rounded-xl shimmer" />
    </div>
  </div>
);

export default ProductCardSkeleton;
