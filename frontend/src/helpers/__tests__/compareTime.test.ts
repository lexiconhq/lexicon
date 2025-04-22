import { compareTime } from '../compareTime'; // Adjust the path as necessary

describe('compareTime', () => {
  it('should return both true for new timestamp and new day when currIndex is 0', () => {
    const { isNewDay, isNewTimestamp } = compareTime({
      data: [],
      currIndex: 0,
    });
    expect(isNewDay).toBe(true);
    expect(isNewTimestamp).toBe(true);
  });

  it('should return both false for new timestamp and new day when data is undefined', () => {
    const { isNewDay, isNewTimestamp } = compareTime({
      data: undefined,
      currIndex: 1,
    });
    expect(isNewDay).toBe(false);
    expect(isNewTimestamp).toBe(false);
  });

  it('should return true for new day when the time difference between current and previous message is different days', () => {
    const data = [
      { time: '2023-04-18T07:59:11.748Z' },
      { time: '2023-04-19T06:20:11.748Z' },
    ];
    const result = compareTime({ data, currIndex: 1 }).isNewDay;
    expect(result).toBe(true);
  });

  it('should return false for new day when the time difference between current and previous message are on the same day', () => {
    const data = [
      { time: '2023-04-18T07:59:11.748Z' },
      { time: '2023-04-18T05:59:11.748Z' },
    ];
    const result = compareTime({ data, currIndex: 1 }).isNewDay;
    expect(result).toBe(false);
  });

  it('should return true for new timestamp when the time difference between current and previous message is more than 15 minutes', () => {
    const data = [
      { time: '2023-04-18T06:36:11.748Z' },
      { time: '2023-04-18T06:20:11.748Z' },
    ];
    const result = compareTime({ data, currIndex: 1 }).isNewTimestamp;
    expect(result).toBe(true);
  });

  it('should return false for new timestamp when the time difference between current and previous message is less than 15 minutes', () => {
    const data = [
      { time: '2023-04-18T07:59:11.748Z' },
      { time: '2023-04-18T07:50:11.748Z' },
    ];
    const result = compareTime({ data, currIndex: 1 }).isNewTimestamp;
    expect(result).toBe(false);
  });

  it('should handle invalid dates gracefully', () => {
    const data = [
      { time: 'invalid-date' },
      { time: '2023-04-18T08:10:11.748Z' },
    ];
    const { isNewDay, isNewTimestamp } = compareTime({ data, currIndex: 1 });
    expect(isNewDay).toBe(false);
    expect(isNewTimestamp).toBe(false);
  });

  it('should return both true for large time differences', () => {
    const data = [
      { time: '2023-04-18T07:59:11.748Z' },
      { time: '2023-04-21T09:00:00.000Z' },
    ];
    const { isNewDay, isNewTimestamp } = compareTime({ data, currIndex: 1 });
    expect(isNewDay).toBe(true);
    expect(isNewTimestamp).toBe(true);
  });
});
