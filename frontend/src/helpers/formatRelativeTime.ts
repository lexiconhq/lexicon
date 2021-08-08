import { formatDateTime } from './formatDateTime';

const secInMiliSecs = 1000;
const minInMiliSecs = 1000 * 60;
const hourInMiliSecs = 1000 * 60 * 60;
const dayInMiliSecs = 1000 * 60 * 60 * 24;
const weekInMiliSecs = 1000 * 60 * 60 * 24 * 7;

type TimeDiffTypes = 'DAY_DIFF' | 'HOUR_DIFF' | 'MIN_DIFF' | 'SEC_DIFF';

type TimeFormat =
  | { type: TimeDiffTypes; data: number }
  | { type: 'DATE'; data: string }
  | { type: 'BRIEF' };

type TimeScale = { scale: number; type: TimeDiffTypes };

export function computeRelativeTime(
  dateString: string,
  showFutureDate = false,
  currentDate: Date = new Date(),
): TimeFormat | null {
  let date = new Date(dateString);

  if (isNaN(date.getDay())) {
    return null;
  }

  const timeInterval = currentDate.getTime() - date.getTime();

  if (timeInterval < 0) {
    return showFutureDate
      ? { type: 'DATE', data: formatDateTime(dateString) }
      : null;
  }

  const dayInterval = Math.floor(timeInterval / weekInMiliSecs);

  if (dayInterval === 0) {
    return sameWeekInterval(timeInterval);
  }

  return { type: 'DATE', data: formatDateTime(dateString) };
}

function sameWeekInterval(timeInterval: number): TimeFormat | null {
  let timeScales: Array<TimeScale> = [
    { scale: dayInMiliSecs, type: 'DAY_DIFF' },
    { scale: hourInMiliSecs, type: 'HOUR_DIFF' },
    { scale: minInMiliSecs, type: 'MIN_DIFF' },
    { scale: secInMiliSecs, type: 'SEC_DIFF' },
  ];

  for (let timeScale of timeScales) {
    const result = timeInterval / timeScale.scale;
    if ((result >= 1 && timeScale.type !== 'SEC_DIFF') || result > 44) {
      return { type: timeScale.type, data: Math.floor(result) };
    }
  }

  return { type: 'BRIEF' };
}

export function formatRelativeTime(
  dateString: string,
  showFutureDate = false,
  showDetail = true,
): string {
  let result = computeRelativeTime(dateString, showFutureDate);

  if (result == null) {
    return t('A long time ago');
  }

  if (!showDetail) {
    switch (result.type) {
      case 'HOUR_DIFF':
      case 'MIN_DIFF':
      case 'SEC_DIFF':
      case 'BRIEF': {
        return t('Today');
      }
      default: {
        return formatDateTime(dateString);
      }
    }
  }

  if (result.type === 'BRIEF') {
    return t('a few seconds ago');
  }

  const { data } = result;

  switch (result.type) {
    case 'DAY_DIFF': {
      return t(`{data}d ago`, { data });
    }
    case 'HOUR_DIFF': {
      return t(`{data}h ago`, { data });
    }
    case 'MIN_DIFF': {
      return t(`{data}m ago`, { data });
    }
    case 'SEC_DIFF': {
      return t(`less than a minute ago`);
    }
    case 'DATE': {
      return result.data;
    }
  }
}
