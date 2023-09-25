import { LikedTopic } from '../types';

type Params = {
  currentLikedTopicResponse: LikedTopic;
  isLiked: boolean;
};

export function getUpdatedLikedTopic(params: Params) {
  const { currentLikedTopicResponse, isLiked: liked } = params;

  const { likeCount: prevLikeCount } = currentLikedTopicResponse;
  const likeCount = liked ? prevLikeCount + 1 : prevLikeCount - 1;
  return {
    ...currentLikedTopicResponse,
    likeCount,
    liked,
  };
}
