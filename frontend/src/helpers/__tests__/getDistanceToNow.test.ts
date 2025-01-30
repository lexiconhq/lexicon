import { getDistanceToNow, getDistance } from '../getDistanceToNow';

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
  // NOTE: Add an extra 10s to make sure that the result will always 10 minutes
  oneHourtenMinutesLater.setSeconds(
    oneHourtenMinutesLater.getSeconds() + 10 * 60 + 10,
  );

  expect(getDistanceToNow(oneHourtenMinutesLater.toISOString())).toEqual(
    '1h 10m',
  );

  const tenSecondLater = new Date();
  tenSecondLater.setSeconds(tenSecondLater.getSeconds() + 10);

  expect(getDistanceToNow(tenSecondLater.toISOString())).toEqual('10s');

  const pastDate = new Date();
  pastDate.setSeconds(tenSecondLater.getSeconds() - 20);

  expect(getDistanceToNow(pastDate.toISOString())).toEqual(undefined);
});

it('should calculate the difference between two dates', () => {
  let firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  let secondDate = new Date(2016, 5, 15, 10, 24, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('1 year');
  expect(getDistance(secondDate, firstDate)).toEqual('1 year');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 7, 15, 10, 24, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('2 months');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 5, 23, 10, 24, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('1 week');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 5, 20, 10, 24, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('5 days');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 5, 15, 13, 24, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('3 hours');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 5, 15, 10, 27, 3).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('7 minutes');

  firstDate = new Date(2015, 5, 15, 10, 20, 3).toString();
  secondDate = new Date(2015, 5, 15, 10, 20, 16).toString();

  expect(getDistance(firstDate, secondDate)).toEqual('13 seconds');

  expect(getDistance(firstDate, firstDate)).toEqual(undefined);
});
