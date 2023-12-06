import { stripHTML } from '../stripHTML';

it('should strip HTML tags', () => {
  expect(
    stripHTML(
      `<strong>Hello</strong> <div>World</div>, did you know 5 > 3? But -5 < 3.`,
    ),
  ).toEqual('Hello World, did you know 5 > 3? But -5 < 3.');
  expect(stripHTML('a < b and c > d')).toEqual('a < b and c > d');
  expect(stripHTML('H<llo. there are error in here ===>')).toEqual('H');
  expect(stripHTML('H<  there are error in here ===>')).toEqual(
    'H<  there are error in here ===>',
  );
});
