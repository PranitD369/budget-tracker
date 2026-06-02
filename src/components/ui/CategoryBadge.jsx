export function CategoryBadge({ name, categories }) {
  const cat = categories?.find(c => c.name === name)
  const color = cat?.color ?? '#6b7280'
  const icon = cat?.icon ?? '📦'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ backgroundColor: color }}
    >
      {icon} {name}
    </span>
  )
}
