function Bone({ className = '' }) {
  return <div className={`animate-pulse rounded-lg bg-bg-surface-hover ${className}`} />;
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border border-border-subtle bg-bg-surface p-4 space-y-3">
      <Bone className="h-4 w-2/3" />
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-4/5" />
      <div className="flex gap-2 pt-1">
        <Bone className="h-6 w-16 rounded-full" />
        <Bone className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border-subtle bg-bg-surface p-3">
      <Bone className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Bone className="h-4 w-1/2" />
        <Bone className="h-3 w-3/4" />
      </div>
    </div>
  );
}

function TextSkeleton() {
  return (
    <div className="space-y-2">
      <Bone className="h-3 w-full" />
      <Bone className="h-3 w-5/6" />
      <Bone className="h-3 w-2/3" />
    </div>
  );
}

const variants = {
  card: CardSkeleton,
  list: ListSkeleton,
  text: TextSkeleton,
};

export default function SkeletonLoader({ variant = 'card', count = 1 }) {
  const Component = variants[variant] || variants.card;

  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <Component key={i} />
      ))}
    </div>
  );
}
