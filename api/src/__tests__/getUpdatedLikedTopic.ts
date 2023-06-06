import { getUpdatedLikedTopic } from '../helpers';

const likeCount = 5;
const currentLikedTopicResponse = {
  id: 12,
  topicId: 1,
  liked: false,
  postId: 2,
  likeCount,
};

it('should increase likeCount and return data in LikedTopic response', () => {
  expect(
    getUpdatedLikedTopic({ currentLikedTopicResponse, isLiked: true }),
  ).toEqual({
    ...currentLikedTopicResponse,
    liked: true,
    likeCount: likeCount + 1,
  });
});

it('should decrease likeCount and return data in LikedTopic response', () => {
  expect(
    getUpdatedLikedTopic({ currentLikedTopicResponse, isLiked: false }),
  ).toEqual({
    ...currentLikedTopicResponse,
    liked: false,
    likeCount: likeCount - 1,
  });
});
