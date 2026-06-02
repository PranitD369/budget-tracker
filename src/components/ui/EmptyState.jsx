export function EmptyState({ icon = '📭', title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 dark:text-gray-400">
      <div className="text-5xl mb-3">{icon}</div>
      <p className="font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  )
}
