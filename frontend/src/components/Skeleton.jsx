// src/components/Skeleton.jsx
export default function Skeleton({
  width = 'w-full',
  height = 'h-4',
  count = 1,
  circle = false,
  className = ''
}) {
  const items = Array.from({ length: count });

  return (
    <>
      {items.map((_, idx) => (
        <div
          key={idx}
          className={`skeleton ${width} ${height} ${circle ? 'rounded-full' : 'rounded'} mb-3 ${className}`}
        />
      ))}
    </>
  );
}

export function CardSkeleton() {
  return (
    <div className="card">
      <Skeleton height="h-12" className="mb-4" />
      <Skeleton count={3} height="h-4" />
    </div>
  );
}

export function TableRowSkeleton({ columns = 4 }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="px-6 py-3">
          <Skeleton height="h-4" />
        </td>
      ))}
    </tr>
  );
}
