export type DateFormatProps = {
  date: Date | string
  className?: string
}

export default function DateFormat ({ date, className }: DateFormatProps) {
  const formatDate = (dateInput: Date | string) => {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
    return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()} ${d.getHours()}:${(d.getMinutes() < 10 ? '0' : '')}${d.getMinutes()}`
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date
  const isoString = dateObj.toISOString()

  return (
    <time className={className} dateTime={isoString}>
      {formatDate(date)}
    </time>
  )
}
