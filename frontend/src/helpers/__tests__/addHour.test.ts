import { addHour } from '../addHour';

describe('addHour', () => {
  it('should add hours to a valid date', () => {
    const inputDate = '2023-09-23T03:07:01.000Z';
    const result = addHour({ dateString: inputDate, hour: 2 });

    const expectedDate = new Date('2023-09-23T05:07:01.000Z');

    expect(result).toEqual(expectedDate);
  });

  it('should return an empty string for an invalid date', () => {
    const inputDate = 'invalid-date-string';
    const result = addHour({ dateString: inputDate, hour: 2 });

    expect(result).toBe('');
  });
});
