import React from 'react';
import { View, ViewProps } from 'react-native';

import { LoadingOrError } from '../../../components';
import { Text } from '../../../core-ui';
import { SearchTags_searchTag as Tag } from '../../../generated/server/SearchTags';
import { makeStyles } from '../../../theme';

import { TagItem } from './TagItem';

type Props = ViewProps & {
  loading: boolean;
  searchTag: string;
  tags: Array<Tag>;
  selectedTags: Array<string>;
  canCreateTag?: boolean;
  onCreateTag: (content: string) => void;
  onSelectedTag: (id: string) => void;
};

export function AvailableTags(props: Props) {
  const styles = useStyles();

  const {
    loading,
    searchTag,
    tags,
    selectedTags,
    canCreateTag,
    onCreateTag,
    onSelectedTag,
    ...otherProps
  } = props;

  let searchSpecialCase;
  let isSearchSelected = selectedTags?.includes(searchTag);

  if (searchTag) {
    if (isSearchSelected) {
      //input value in search text field is selected
      searchSpecialCase = (
        <TagItem tagName={searchTag} rightLabel={t('selected')} />
      );
    } else if (!tags.find(({ id }) => id === searchTag) && canCreateTag) {
      //input value in search text field is not found, but user can create that tag
      searchSpecialCase = (
        <TagItem
          tagName={searchTag}
          rightLabel={t('create tag')}
          onItemPress={onCreateTag}
        />
      );
    }
  }

  let loadingOrNoData =
    tags.length === 0 && !isSearchSelected ? (
      <View style={styles.content}>
        {!loading ? (
          <Text>
            {!canCreateTag
              ? t('No existing tags were found.')
              : searchTag === ''
              ? t(
                  'No existing tags were found. Create one by typing it in the search bar above.',
                )
              : null}
          </Text>
        ) : (
          <LoadingOrError loading />
        )}
      </View>
    ) : null;

  return (
    <View {...otherProps}>
      <Text variant="bold">{searchTag ? t('Results') : t('Popular Tags')}</Text>
      {!searchTag && tags.length > 0 && (
        <Text size="s" style={styles.smallText}>
          {canCreateTag
            ? t('Use the search bar to discover more tags or create a new one.')
            : t('Use the search bar to discover more tags.')}
        </Text>
      )}

      {searchSpecialCase}

      {tags.map((tag) => (
        <TagItem
          key={tag.id}
          onItemPress={onSelectedTag}
          tagName={tag.id}
          rightIcon="AddCircle"
        />
      ))}

      {loadingOrNoData}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xl,
  },
  smallText: {
    paddingTop: spacing.m,
  },
}));
