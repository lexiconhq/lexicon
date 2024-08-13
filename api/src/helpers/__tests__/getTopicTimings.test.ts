import { getTopicTimings } from '..';

it('Should send back timings input object', () => {
  const inputPost = [2, 3, 4];
  const inputTopicId = 123;
  const expectedOutput = {
    timings: {
      2: 1000,
      3: 1000,
      4: 1000,
    },
    topicId: 123,
    topicTime: 1000,
  };
  let timingsInputObject = getTopicTimings(inputPost, inputTopicId);
  expect(timingsInputObject).toEqual(expectedOutput);
});
