import { capitalizeAllWords } from '../capitalizeFirstLetter';

it('should return new format text', () => {
  expect(capitalizeAllWords('hi john')).toEqual('Hi John');

  expect(capitalizeAllWords('this is the end')).toEqual('This Is The End');
});
