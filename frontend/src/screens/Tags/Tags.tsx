import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView } from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation, useRoute } from '@react-navigation/native';

import { CustomHeader, HeaderItem, ModalHeader } from '../../components';
import { Button, Text } from '../../core-ui';
import {
  SearchTagsQuery,
  SearchTagsQueryVariables,
} from '../../generated/server';
import { client } from '../../graphql/client';
import { SEARCH_TAGS } from '../../graphql/server/search';
import { formatTag } from '../../helpers';
import { useSiteSettings, useTags } from '../../hooks';
import { makeStyles } from '../../theme';
import { RootStackNavProp, RootStackRouteProp, Tag } from '../../types';

import { AvailableTags, SearchBar, SelectedTags } from './components';

export default function Tags() {
  const styles = useStyles();

  const navigation = useNavigation<RootStackNavProp<'Tags'>>();
  const { navigate, goBack } = navigation;

  const {
    params: { selectedTagsIds },
  } = useRoute<RootStackRouteProp<'Tags'>>();

  const {
    canCreateTag = false,
    maxTagLength,
    maxTagsPerTopic = 5,
  } = useSiteSettings();

  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [tags, setTags] = useState<Array<Tag>>([]);
  const [currentTagsIds, setCurrentTagsIds] =
    useState<Array<string>>(selectedTagsIds);
  const [error, setError] = useState<string | null>(null);

  const close = useRef(false);

  const ios = Platform.OS === 'ios';

  const {
    getTags,
    loading: tagsLoading,
    refetch,
  } = useTags({
    variables: { q: searchValue, selectedTags: currentTagsIds },
    onCompleted: ({ searchTag }) => {
      setTags([...searchTag]);
      setLoading(false);
    },
  });

  useEffect(() => {
    try {
      const cache = client.readQuery<SearchTagsQuery, SearchTagsQueryVariables>(
        {
          query: SEARCH_TAGS,
          variables: { q: searchValue, selectedTags: currentTagsIds },
        },
      );

      if (cache) {
        setTags(cache.searchTag);
        setLoading(false);
      }
    } catch (e) {
      setLoading(true);
      if (tags && tags.length < 1) {
        getTags();
      } else {
        refetch && refetch();
      }
    }
  }, [setTags, getTags, refetch, searchValue, currentTagsIds, tags]);

  const availableTags = tags.filter((tag) => !currentTagsIds.includes(tag.id));

  useEffect(() => {
    if (ios) {
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (close.current) {
          return;
        }

        e.preventDefault();
        submitTags();
      });

      return unsubscribe;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitTags]);

  function setErrorMessage(type: 'EXIST' | 'MAX_EXCEED') {
    switch (type) {
      case 'EXIST': {
        setError('The tag you tried to create already exists. ');
        return;
      }
      case 'MAX_EXCEED': {
        setError(
          `You can only select up to ${maxTagsPerTopic} tags in a post.`,
        );
      }
    }
  }

  function onSelectedTag(id: string) {
    let tagsIds = new Set(currentTagsIds);

    if (tagsIds.has(id)) {
      tagsIds.delete(id);
    } else if (currentTagsIds.length < maxTagsPerTopic) {
      tagsIds.add(id);
      setSearchValue('');
    } else {
      setErrorMessage('MAX_EXCEED');
      return;
    }
    setError(null);
    setCurrentTagsIds(Array.from(tagsIds));
    getTags();
  }

  function onCreateTag(content: string) {
    if (currentTagsIds.length >= maxTagsPerTopic) {
      setErrorMessage('MAX_EXCEED');
      return;
    }

    let tagsIds = new Set(currentTagsIds);
    if (tagsIds.has(formatTag(content, maxTagLength))) {
      setErrorMessage('EXIST');
      return;
    }

    setError(null);
    let newTag = {
      id: formatTag(content),
      text: formatTag(content),
      count: 0,
    };
    setCurrentTagsIds([...currentTagsIds, newTag.id]);
    setSearchValue('');
  }

  function submitTags() {
    close.current = true;
    navigate('NewPost', { selectedTagsIds: currentTagsIds });
  }

  function cancelAddTags() {
    close.current = true;
    goBack();
  }

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('Add Tags')}
        left={
          <HeaderItem label={t('Cancel')} left onPressItem={cancelAddTags} />
        }
        right={
          <HeaderItem
            label={t('Done')}
            onPressItem={submitTags}
            disabled={currentTagsIds.length === 0 && loading}
          />
        }
      />
    ) : (
      <CustomHeader title={t('Add Tags')} noShadow />
    );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <KeyboardAwareScrollView
        scrollEventThrottle={0}
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <SearchBar
          searchValue={searchValue}
          onSearchValueChange={(value) => [
            setSearchValue(value),
            setError(null),
          ]}
          style={styles.searchBar}
        />

        <SelectedTags
          selectedTags={currentTagsIds}
          onSelectedTag={onSelectedTag}
          style={styles.selectedTags}
        />
        {error && (
          <>
            <Text color="error" style={styles.selectedTags}>
              {t('{error}', { error })}
            </Text>
          </>
        )}
        <AvailableTags
          loading={loading || tagsLoading}
          tags={availableTags}
          searchTag={formatTag(searchValue, maxTagLength)}
          selectedTags={currentTagsIds}
          canCreateTag={canCreateTag}
          onCreateTag={onCreateTag}
          onSelectedTag={onSelectedTag}
          style={styles.availableTags}
        />
      </KeyboardAwareScrollView>
      {!ios && (
        <KeyboardAccessoryView
          androidAdjustResize
          inSafeAreaView
          hideBorder
          alwaysVisible
          style={styles.container}
        >
          <Button
            content={t('Done')}
            large
            onPress={submitTags}
            disabled={currentTagsIds.length === 0 && loading}
            style={styles.bottomMenu}
          />
        </KeyboardAccessoryView>
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.xxl,
  },
  searchBar: {
    padding: spacing.m,
    marginTop: spacing.m,
    marginBottom: spacing.xl,
  },
  selectedTags: {
    paddingBottom: spacing.l,
  },
  availableTags: {
    marginTop: spacing.l,
  },
  bottomMenu: {
    marginVertical: spacing.xl,
    marginHorizontal: spacing.xxl,
  },
}));
