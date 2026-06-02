export function BudgetProgressBar({ percentage }) {
  const color = percentage >= 90 ? 'bg-red-500' : percentage >= 70 ? 'bg-yellow-400' : 'bg-emerald-500'
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  )
}
