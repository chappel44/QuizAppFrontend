export function ThinkingSpark({ size = 32, petals = 8 }: { size?: number; petals?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-50 -50 100 100"
      role="status"
      aria-label="Thinking"
      className="animate-[spin_6s_linear_infinite] motion-reduce:animate-none"
    >
      {Array.from({ length: petals }).map((_, i) => (
        <g key={i} transform={`rotate(${(360 / petals) * i})`}>
          <rect
            x="-4"
            y="-44"
            width="8"
            height="30"
            rx="4"
            className="fill-blue-500 origin-center animate-petal motion-reduce:animate-none"
            style={{ animationDelay: `${(i * 1.2) / petals}s` }}
          />
        </g>
      ))}
    </svg>
  )
}