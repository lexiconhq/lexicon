import React from 'react';
import { ScrollView, View, ViewProps } from 'react-native';

import { Chip, Icon, Text } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = ViewProps & {
  selectedTags: Array<string>;
  onSelectedTag: (id: string) => void;
};

export function SelectedTags(props: Props) {
  const styles = useStyles();
  const { colors, spacing } = useTheme();

  const { selectedTags, onSelectedTag, ...otherProps } = props;

  return (
    <View {...otherProps}>
      <Text variant="bold">{t('Selected Tags')}</Text>
      <View style={styles.selectedTagsContainer}>
        {selectedTags.length === 0 ? (
          <View style={styles.labelNoSelectedTags}>
            <Text>{t('No selected tags')}</Text>
          </View>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {selectedTags.map((tag, index) => {
              const spacingStyle = { marginEnd: spacing.m };
              const closeIcon = (
                <Icon name="Close" size="xs" color={colors.textLighter} />
              );
              return (
                <Chip
                  key={tag}
                  content={tag}
                  large
                  right={closeIcon}
                  onPress={() => onSelectedTag(tag)}
                  style={
                    index !== selectedTags.length - 1 ? spacingStyle : undefined
                  }
                />
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  selectedTagsContainer: {
    paddingTop: spacing.m,
  },
  labelNoSelectedTags: {
    height: 40,
    justifyContent: 'center',
  },
}));
