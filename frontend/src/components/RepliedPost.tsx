import React from 'react';
import { View } from 'react-native';

import { Divider } from '../core-ui';
import { handleSpecialMarkdown } from '../helpers';
import { makeStyles } from '../theme';
import { Post } from '../types';

import { Author } from './Author';
import { Markdown } from './Markdown';

type Props = {
  hideAuthor?: boolean;
  replyTo?: Post;
};

export { Props as RepliedPostProps };

export function RepliedPost(props: Props) {
  const styles = useStyles();

  const { hideAuthor = false, replyTo } = props;

  return (
    <View style={styles.nestedRowContainer}>
      <Divider vertical />
      <View style={styles.nestedCommentContainer}>
        {!hideAuthor && (
          <Author
            image={replyTo?.avatar || ''}
            title={replyTo?.username || ''}
          />
        )}
        <Markdown
          style={styles.nestedContent}
          imageUrls={replyTo?.images}
          content={handleSpecialMarkdown(replyTo?.content || '')}
          listOfMention={replyTo?.mentionedUsers}
        />
      </View>
    </View>
  );
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
