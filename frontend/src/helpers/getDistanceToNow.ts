import { Duration, intervalToDuration } from 'date-fns';

// NOTE: date-fns doesn't add weeks by default, so we need to add it manually
function addWeeks(duration: Duration) {
  if (!duration.weeks && duration.days) {
    duration.weeks = Math.floor(duration.days / 7);
    duration.days -= duration.weeks * 7;
  }
  return duration;
}

function getDuration(start: Date, end: Date, combineTime?: boolean) {
  if (start.toString() === end.toString()) {
    return undefined;
  }

  const { years, months, weeks, days, hours, minutes, seconds } = addWeeks(
    intervalToDuration({
      start,
      end,
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

  if (combineTime) {
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
  } else {
    if (hours) {
      return `${hours} ${hours > 1 ? 'hours' : 'hour'}`;
    }
    if (minutes) {
      return `${minutes} ${minutes > 1 ? 'minutes' : 'minute'}`;
    }
    if (seconds) {
      return `${seconds} ${seconds > 1 ? 'seconds' : 'second'}`;
    }
  }
}

export function getDistanceToNow(date: string) {
  const endDate = new Date(date);
  const now = new Date();

  if (now > endDate) {
    return undefined;
  }

  return getDuration(now, endDate, true);
}

export function getDistance(date: string, baseDate: string) {
  const firstDate = new Date(date);
  const secondDate = new Date(baseDate);

  let param = { start: firstDate, end: secondDate };
  if (firstDate > secondDate) {
    param = { start: secondDate, end: firstDate };
  }

  return getDuration(param.start, param.end);
}
