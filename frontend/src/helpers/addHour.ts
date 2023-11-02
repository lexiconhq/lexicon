export function addHour({
  dateString,
  hour,
}: {
  dateString: string | number;
  hour: number;
}) {
  let date = new Date(dateString);
  if (isNaN(date.getDate())) {
    return '';
  }
  const newTimestamp = date.getTime() + hour * 60 * 60 * 1000;
  const newDate = new Date(newTimestamp);
  return newDate;
}
