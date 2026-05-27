import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Keyboard,
  TouchableOpacity,
  View,
} from 'react-native';

import { CustomHeader } from '../../components';
import { MAX_HIDDEN_WORDS } from '../../constants/hiddenWords';
import { Button, Icon, Text, TextInput } from '../../core-ui';
import { makeStyles, useTheme } from '../../theme';
import { useHiddenWords } from '../../utils';

export default function HiddenWords() {
  const styles = useStyles();
  const { colors } = useTheme();
  const {
    hiddenWordsList,
    addHiddenWord,
    removeHiddenWord,
    isAtLimit,
    reloadHiddenWords,
  } = useHiddenWords();
  const [draft, setDraft] = useState('');

  useFocusEffect(
    useCallback(() => {
      return () => {
        reloadHiddenWords();
      };
    }, [reloadHiddenWords]),
  );

  const onAdd = () => {
    if (addHiddenWord(draft)) {
      setDraft('');
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader title={t('Hidden Words')} />
      <View style={styles.content}>
        <Text style={styles.description}>
          {t(
            'Posts, comments, and profiles that contain these words are hidden in this app only. Your list is stored on this device and is not synced to the forum.',
          )}
        </Text>
        <Text style={styles.count} color="textLight">
          {t('{current} of {max} words', {
            current: hiddenWordsList.length,
            max: MAX_HIDDEN_WORDS,
          })}
        </Text>

        <View style={styles.addRow}>
          <TextInput
            label={t('Add a word')}
            value={draft}
            onChangeText={setDraft}
            placeholder={t('e.g. spoiler')}
            style={styles.input}
            editable={!isAtLimit}
            onSubmitEditing={onAdd}
            returnKeyType="done"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Button
            content={t('Add')}
            onPress={onAdd}
            disabled={!draft.trim() || isAtLimit}
            style={styles.addButton}
          />
        </View>

        {hiddenWordsList.length === 0 ? (
          <View style={styles.empty}>
            <Text color="textLight" style={styles.emptyText}>
              {t('You have not added any hidden words yet.')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={hiddenWordsList}
            keyExtractor={(word) => word}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            renderItem={({ item: word }) => (
              <View style={styles.row}>
                <Text variant="semiBold" style={styles.word}>
                  {word}
                </Text>
                <TouchableOpacity
                  onPress={() => removeHiddenWord(word)}
                  hitSlop={{ top: 12, right: 12, bottom: 12, left: 12 }}
                  accessibilityLabel={t('Remove {word}', { word })}
                >
                  <Icon name="Close" color={colors.textLighter} size="l" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.l,
  },
  description: {
    color: colors.textLight,
    marginBottom: spacing.m,
  },
  count: {
    marginBottom: spacing.xl,
  },
  addRow: {
    marginBottom: spacing.xl,
  },
  input: {
    marginBottom: spacing.m,
  },
  addButton: {
    alignSelf: 'flex-start',
  },
  listContent: {
    paddingBottom: spacing.xxxl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  word: {
    flex: 1,
    marginRight: spacing.m,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyText: {
    textAlign: 'center',
  },
}));
