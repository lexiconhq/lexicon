import { formatCount } from '../formatCount';

it('should return original number', () => {
  expect(formatCount(10)).toEqual('10');
});

it('should return original number', () => {
  expect(formatCount(-1)).toEqual('-1');
});

it('should return number with symbols for thousands', () => {
  expect(formatCount(1100)).toEqual('1.1k');
});

it('should return number with symbols for thousands', () => {
  expect(formatCount(1000)).toEqual('1k');
});

it('should return number with symbols for millions', () => {
  expect(formatCount(1030000)).toEqual('1.03M');
});

it('should return number with symbols for millions', () => {
  expect(formatCount(1000000)).toEqual('1M');
});
