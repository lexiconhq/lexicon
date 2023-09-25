import React from 'react';
import { View } from 'react-native';

import { Divider } from '../core-ui';
import {
  PostFragment,
  PostFragmentDoc,
  useRepliedPostQuery,
} from '../generated/server';
import { client } from '../graphql/client';
import { handleUnsupportedMarkdown, RepliedPostLoadFail } from '../helpers';
import { makeStyles } from '../theme';

import { Author } from './Author';
import { Markdown } from './Markdown';
import { LoadingOrError } from './LoadingOrError';

type GeneralRepliedPostProps = {
  hideAuthor?: boolean;
};

type BaseRepliedPostProps = GeneralRepliedPostProps &
  Pick<PostFragment, 'avatar' | 'username' | 'markdownContent' | 'mentions'>;

function BaseRepliedPost(props: BaseRepliedPostProps) {
  const styles = useStyles();

  let { avatar, username, markdownContent, mentions, hideAuthor } = props;

  return (
    <View style={styles.nestedRowContainer}>
      <Divider vertical />
      <View style={styles.nestedCommentContainer}>
        {!hideAuthor && <Author image={avatar} title={username} />}
        <Markdown
          style={styles.nestedContent}
          content={handleUnsupportedMarkdown(markdownContent ?? undefined)}
          mentions={mentions ?? undefined}
        />
      </View>
    </View>
  );
}

type RepliedPostLoadingOrErrorProps = {
  loading?: boolean;
  error?: boolean;
};

function RepliedPostLoadingOrError({
  loading,
  error,
}: RepliedPostLoadingOrErrorProps) {
  const styles = useStyles();

  return (
    <View style={styles.nestedRowContainer}>
      <Divider vertical />
      <View style={styles.nestedCommentContainer}>
        <LoadingOrError
          message={error ? RepliedPostLoadFail : undefined}
          loading={loading}
        />
      </View>
    </View>
  );
}

type RepliedPostProps = {
  postId: number;
  replyToPostId?: number;
} & GeneralRepliedPostProps;

export function RepliedPost(props: RepliedPostProps) {
  const { hideAuthor = false, postId, replyToPostId } = props;
  const { data, loading, error } = useRepliedPostQuery({
    variables: {
      postId, //used to look for replies of current post
      replyToPostId, //used to look post at cache
    },
  });
  if (!data || loading) {
    return <RepliedPostLoadingOrError loading={loading} error={!!error} />;
  }

  let { replyingTo } = data;

  return <BaseRepliedPost {...replyingTo} hideAuthor={hideAuthor} />;
}

type LocalRepliedPostProps = {
  replyToPostId: number;
} & GeneralRepliedPostProps;

export function LocalRepliedPost(props: LocalRepliedPostProps) {
  let replyingTo = client.readFragment<PostFragment>({
    fragment: PostFragmentDoc,
    id: `Post:${String(props.replyToPostId)}`,
  });
  if (!replyingTo) {
    return <RepliedPostLoadingOrError error={true} />;
  }

  return <BaseRepliedPost {...replyingTo} hideAuthor={props.hideAuthor} />;
}

const useStyles = makeStyles(({ spacing }) => ({
  nestedRowContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  nestedCommentContainer: {
    flex: 1,
    paddingHorizontal: spacing.xl,
  },
  nestedContent: {
    marginTop: spacing.xl,
  },
}));

export { RepliedPostProps, LocalRepliedPostProps };
