import { Duration, intervalToDuration } from 'date-fns';

// NOTE: date-fns doesn't add weeks by default, so we need to add it manually
function addWeeks(duration: Duration) {
  if (!duration.weeks && duration.days) {
    duration.weeks = Math.floor(duration.days / 7);
    duration.days -= duration.weeks * 7;
  }
  return duration;
}

export function getDistanceToNow(date: string) {
  const endDate = new Date(date);
  const now = new Date();

  if (now > endDate) {
    return undefined;
  }

  const { years, months, weeks, days, hours, minutes, seconds } = addWeeks(
    intervalToDuration({
      start: now,
      end: endDate,
    }),
  );

  if (years) {
    return `${years} ${years > 1 ? 'years' : 'year'}`;
  }
  if (months) {
    return `${months} ${months > 1 ? 'months' : 'month'}`;
  }
  if (weeks) {
    return `${weeks} ${weeks > 1 ? 'weeks' : 'week'}`;
  }
  if (days) {
    return `${days} ${days > 1 ? 'days' : 'day'}`;
  }

  let result = [];
  if (hours) {
    result.push(`${hours}h`);
  }
  if (minutes) {
    result.push(`${minutes}m`);
  }
  if (!hours && !minutes && seconds) {
    result.push(`${seconds}s`);
  }

  return result.join(' ');
}
