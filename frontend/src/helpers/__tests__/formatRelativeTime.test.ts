import { computeRelativeTime } from '../formatRelativeTime';

describe('formatRelativeTime', () => {
  it('should return null', () => {
    expect(computeRelativeTime('a')).toEqual(null);
  });

  it('should return null', () => {
    let time = '2020-08-09T16:28:06.330Z';
    let currTime = new Date('2020-08-09T16:25:06.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual(null);
  });

  it('should return brief', () => {
    let time = '2020-08-09T16:28:06.330Z';
    let time2 = '2020-08-09T16:27:56.330Z';
    let currTime = new Date('2020-08-09T16:28:06.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual({
      type: 'BRIEF',
    });
    expect(computeRelativeTime(time2, false, currTime)).toEqual({
      type: 'BRIEF',
    });
  });

  it('should return time difference in secs', () => {
    let time = '2020-08-09T16:28:56.330Z';
    let currTime = new Date('2020-08-09T16:29:45.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual({
      type: 'SEC_DIFF',
      data: 49,
    });
  });

  it('should return time difference in mins', () => {
    let time = '2020-08-09T16:28:06.330Z';
    let currTime = new Date('2020-08-09T16:29:06.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual({
      type: 'MIN_DIFF',
      data: 1,
    });
  });

  it('should return time difference in hours', () => {
    let time = '2020-08-09T16:28:06.330Z';
    let time2 = '2020-08-08T23:28:06.330Z';
    let currTime = new Date('2020-08-09T23:26:06.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual({
      type: 'HOUR_DIFF',
      data: 6,
    });
    expect(computeRelativeTime(time2, false, currTime)).toEqual({
      type: 'HOUR_DIFF',
      data: 23,
    });
  });

  it('should return time difference in days', () => {
    let time = '2020-08-07T20:28:06.330Z';
    let time2 = '2020-08-08T23:28:06.330Z';
    let currTime = new Date('2020-08-09T23:28:06.330Z');

    expect(computeRelativeTime(time, false, currTime)).toEqual({
      type: 'DAY_DIFF',
      data: 2,
    });
    expect(computeRelativeTime(time2, false, currTime)).toEqual({
      type: 'DAY_DIFF',
      data: 1,
    });
  });

  it('should return formatted date', () => {
    let time = '2020-08-01T23:28:06.330Z';
    let currTime = '2020-08-09T21:26:06.330Z';

    expect(computeRelativeTime(time, false, new Date(currTime))).toBeTruthy();
    expect(computeRelativeTime(time, false, new Date(currTime))?.type).toEqual(
      'DATE',
    );
    expect(computeRelativeTime(currTime, true, new Date(time))?.type).toEqual(
      'DATE',
    );
  });
});
