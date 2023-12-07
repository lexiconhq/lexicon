import React from 'react';
import { Platform, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  Author,
  CustomHeader,
  HeaderItem,
  ModalHeader,
  PollPreview,
} from '../../components';
import { makeStyles } from '../../theme';
import { RootStackNavProp, RootStackRouteProp } from '../../types';
import { formatRelativeTime, getPollChoiceLabel } from '../../helpers';

export default function Poll() {
  const styles = useStyles();

  const navigation = useNavigation<RootStackNavProp<'Poll'>>();
  const { goBack, navigate } = navigation;
  let { params } = useRoute<RootStackRouteProp<'Poll'>>();
  const { poll, pollVotes, isCreator, postId, topicId, author, createdAt } =
    params;
  const ios = Platform.OS === 'ios';

  const time =
    createdAt === '' ? t('Loading...') : formatRelativeTime(createdAt);

  const onPressAuthor = (username: string) => {
    navigate('UserInformation', { username });
  };

  const Header = () => {
    const title = getPollChoiceLabel({
      title: poll.title ?? undefined,
      pollType: poll.type,
    });
    return ios ? (
      <ModalHeader
        title={title}
        left={<HeaderItem label={t('Close')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={title} noShadow />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      {author && (
        <Author
          image={author.avatar}
          title={author.username}
          subtitle={time}
          style={styles.spacingBottom}
          subtitleStyle={styles.textTime}
          onPressAuthor={onPressAuthor}
        />
      )}
      <ScrollView contentContainerStyle={styles.pollTypesContentContainer}>
        <PollPreview
          poll={poll}
          pollVotes={pollVotes}
          isCreator={isCreator}
          postId={postId}
          topicId={topicId}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing, fontSizes }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  pollTypesContentContainer: {
    paddingHorizontal: spacing.xxl,
    paddingBottom: spacing.s,
  },
  spacingBottom: { marginBottom: spacing.xl, paddingHorizontal: spacing.xxl },
  textTime: { fontSize: fontSizes.s },
}));
