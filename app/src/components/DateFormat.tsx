export type DateFormatProps = {
  date: Date
  className?: string
}

export default function DateFormat ({ date, className }: DateFormatProps) {
  return (
    <time className={className} dateTime={date.toISOString()}>
      {date.getDate()}-{date.getMonth() + 1}-{date.getFullYear() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}
    </time>
  )
}
