export default function TurfCardSkeleton() {
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex gap-2">
          <div className="skeleton h-5 w-16 rounded-full" />
          <div className="skeleton h-5 w-20 rounded-full" />
        </div>
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/2" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-6 w-20" />
          <div className="skeleton h-9 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
