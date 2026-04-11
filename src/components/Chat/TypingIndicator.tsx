export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-up">
      <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[11px] font-bold text-white select-none">S</span>
      </div>
      <div className="flex items-center gap-1.5 py-3">
        {[0, 1, 2].map(i => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-tx-muted animate-pulse-dot"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}
