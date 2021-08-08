import { LikePost, LikePostVariables } from '../../generated/server/LikePost';
import { likePost } from '../../graphql/server/likePost';
import { errorHandlerAlert } from '../../helpers';
import { useMutation } from '../../utils';

export function useLikePost(
  likeCount: number,
  setLikeCount: (val: number) => void,
  postList?: boolean,
  postId?: number,
  tempLiked?: Array<number>,
  setTempLiked?: (val: Array<number>) => void,
  tempLikedShadow?: Array<number>,
  setTempLikedShadow?: (val: Array<number>) => void,
  counter?: number,
  setCounter?: (val: number) => void,
) {
  const [like, { loading }] = useMutation<LikePost, LikePostVariables>(
    likePost,
    {
      onError: (e) => {
        if (postList && postId && tempLikedShadow) {
          let counter = likeCount;
          if (!tempLikedShadow.includes(postId)) {
            setTempLikedShadow &&
              setTempLikedShadow([...tempLikedShadow, postId]);
            setCounter && setCounter(counter ? counter + 1 : 0);
          } else {
            let index = tempLikedShadow.indexOf(postId);
            let revertTempLiked = [...tempLikedShadow];
            if (index >= 0) {
              revertTempLiked?.splice(index, 1);
            }
            setTempLikedShadow && setTempLikedShadow(revertTempLiked);
            setCounter && setCounter(counter ? counter - 1 : 0);
          }
        }
        setLikeCount && setLikeCount(counter ? counter : 0);
        setTempLiked && tempLikedShadow && setTempLiked([...tempLikedShadow]);
        errorHandlerAlert(e, undefined, false);
      },
    },
  );

  return { like, loading };
}
