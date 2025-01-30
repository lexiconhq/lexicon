import { LikedTopic } from '../../../types/api';

type Params = {
  currentLikedTopicResponse: LikedTopic;
  isLiked: boolean;
};

export function getUpdatedLikedTopic(params: Params) {
  const { currentLikedTopicResponse, isLiked: liked } = params;

  let { likeCount } = currentLikedTopicResponse;
  const prevLikeCount = likeCount ?? 0;
  likeCount = liked ? prevLikeCount + 1 : prevLikeCount - 1;
  return {
    ...currentLikedTopicResponse,
    likeCount,
    liked,
  };
}
