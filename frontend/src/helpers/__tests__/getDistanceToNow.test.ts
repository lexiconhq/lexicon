import { getDistanceToNow } from '../getDistanceToNow';

it('should calculate the difference between an upcoming date and the current date', () => {
  const oneYearOneDayLater = new Date();
  oneYearOneDayLater.setMonth(oneYearOneDayLater.getMonth() + 12);
  oneYearOneDayLater.setDate(oneYearOneDayLater.getDate() + 1);

  expect(getDistanceToNow(oneYearOneDayLater.toISOString())).toEqual('1 year');

  const twoMonthsLater = new Date();
  twoMonthsLater.setDate(twoMonthsLater.getDate() + 63);

  expect(getDistanceToNow(twoMonthsLater.toISOString())).toEqual('2 months');

  const twoWeeksLater = new Date();
  twoWeeksLater.setDate(twoWeeksLater.getDate() + 15);

  expect(getDistanceToNow(twoWeeksLater.toISOString())).toEqual('2 weeks');

  const twoDaysLater = new Date();
  twoDaysLater.setHours(twoDaysLater.getHours() + 49);

  expect(getDistanceToNow(twoDaysLater.toISOString())).toEqual('2 days');

  const oneHourtenMinutesLater = new Date();
  oneHourtenMinutesLater.setHours(oneHourtenMinutesLater.getHours() + 1);
  oneHourtenMinutesLater.setMinutes(oneHourtenMinutesLater.getMinutes() + 10);

  expect(getDistanceToNow(oneHourtenMinutesLater.toISOString())).toEqual(
    '1h 10m',
  );
});
