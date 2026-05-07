const LoadingSkeleton = ({ fullScreen = false, rows = 4 }) => (
  <div className={fullScreen ? "grid min-h-screen place-items-center bg-slate-100 dark:bg-slate-950" : ""}>
    <div className="w-full space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="glass h-24 animate-pulse rounded-lg" />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;

