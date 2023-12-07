import { getListNumberStep, changeListNumberOption } from '../listNumberStep';

describe('list step number test', () => {
  it('should return correct step number', () => {
    expect(getListNumberStep({ min: 1, max: 10, step: 2 })).toEqual([
      1, 3, 5, 7, 9,
    ]);

    expect(getListNumberStep({ min: 3, max: 9, step: 3 })).toEqual([3, 6, 9]);

    expect(getListNumberStep({ min: 1, max: 20, step: 10 })).toEqual([1, 11]);
  });

  it('should return empty array', () => {
    expect(getListNumberStep({ min: 1, max: 10, step: -1 })).toEqual([]);
  });
});

describe('generate option list from array number', () => {
  it('should return list of option', () => {
    expect(changeListNumberOption([1, 2, 3, 4, 5])).toEqual([
      { option: '1' },
      { option: '2' },
      { option: '3' },
      { option: '4' },
      { option: '5' },
    ]);
  });
});
