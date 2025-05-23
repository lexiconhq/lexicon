import { OperationVariables, useFragment_experimental } from '@apollo/client';
import React from 'react';

import {
  UserActionFragment,
  UserActionFragmentDoc,
} from '../../generatedAPI/server';
import { findChannelByCategoryId, getImage, useStorage } from '../../helpers';

import { PostItem, PostItemProps } from './PostItem';

type Props = Pick<PostItemProps, 'currentUser' | 'topicId' | 'style'> & {
  postId?: number | null;
  actionType: number;
};
const LIKED_ACTION_TYPE = 1;

function BaseUserInformationPostItem(props: Props) {
  const storage = useStorage();

  const { topicId, postId, actionType, currentUser, style } = props;

  const cacheUserActionResult = useFragment_experimental<
    UserActionFragment,
    OperationVariables
  >({
    fragment: UserActionFragmentDoc,
    fragmentName: 'UserActionFragment',
    from: {
      __typename: 'UserActions',
      postId: postId,
      topicId: topicId,
      actionType,
    },
  });
  let cacheUserAction = cacheUserActionResult.data;

  if (!cacheUserActionResult.complete || !cacheUserAction) {
    /**
     * This shouldn't ever happen since UserActions
     * have always already loaded the UserInformation screens by this point.
     */
    throw new Error('Post not found');
  }

  let {
    title,
    excerpt,
    avatarTemplate,
    categoryId,
    hidden,
    createdAt,
    username,
    markdownContent: content,
  } = cacheUserAction;
  const channels = storage.getItem('channels');

  const channel = findChannelByCategoryId({
    categoryId: categoryId,
    channels,
  });

  let avatar = getImage(avatarTemplate);
  let isLiked = actionType === LIKED_ACTION_TYPE;

  return (
    <PostItem
      topicId={topicId}
      title={title}
      currentUser={currentUser}
      content={content || excerpt}
      avatar={avatar}
      channel={channel}
      hidden={!!hidden}
      createdAt={createdAt}
      username={username}
      isLiked={isLiked}
      showLabel
      showImageRow
      style={style}
    />
  );
}

let UserInformationPostItem = React.memo(BaseUserInformationPostItem);
export { UserInformationPostItem, Props as UserInformationPostItemProps };
