export type  TimeFormatProps = {
  minutes: number
  className?: string
}

export default function TimeFormat ({ minutes, className }: TimeFormatProps) {
  // Hours and minutes, Xh Ym
  return (
    <time className={className}>
      {Math.floor(minutes / 60)}h {minutes % 60}m
    </time>
  )
}
