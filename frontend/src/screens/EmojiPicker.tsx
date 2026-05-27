import { useNavigation } from '@react-navigation/native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Platform,
  SafeAreaView,
  View,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { CustomHeader, HeaderItem, ModalHeader } from '../components';
import { FONT_SIZES, SPACING } from '../constants';
import { Text, TextInput } from '../core-ui';
import { completeEmojiSelection } from '../helpers/emojiPickerSelection';
import {
  ALL_EMOJI_ROWS,
  EmojiItem,
  filterEmojiRows,
} from '../helpers/emojiSearch';
import { generateSlug } from '../helpers/generateSlug';
import { makeStyles } from '../theme';
import { RootStackNavProp } from '../types';

const EMOJI_ROW_HEIGHT = SPACING.m * 2 + FONT_SIZES.xl;
const SEARCH_DEBOUNCE_MS = 150;

type EmojiPickerRowProps = {
  row: Array<EmojiItem>;
  onSelect: (name: string, emoji: string) => void;
  cellStyle: ViewStyle;
  rowStyle: ViewStyle;
};

const EmojiPickerRow = React.memo(function EmojiPickerRow(props: EmojiPickerRowProps) {
  const { row, onSelect, cellStyle, rowStyle } = props;

  return (
    <View style={rowStyle}>
      {row.map(({ id, name, emoji }) => (
        <TouchableOpacity
          key={id}
          style={cellStyle}
          onPress={() => onSelect(name, emoji)}
          testID={`EmojiPicker:Button:Emoji:${name}`}
        >
          <Text size="xl">{emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
});

export default function EmojiPicker() {
  const styles = useStyles();
  const navigation = useNavigation<RootStackNavProp<'EmojiPicker'>>();
  const { goBack } = navigation;
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showList, setShowList] = useState(true);
  const ios = Platform.OS === 'ios';
  const isSelectingRef = useRef(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query]);

  const emojiRows = useMemo(
    () => (debouncedQuery ? filterEmojiRows(debouncedQuery) : ALL_EMOJI_ROWS),
    [debouncedQuery],
  );

  const onSelectEmoji = useCallback(
    (name: string, emoji: string) => {
      if (isSelectingRef.current) {
        return;
      }

      isSelectingRef.current = true;
      setShowList(false);
      completeEmojiSelection({ emojiCode: name, emojiText: emoji });
      goBack();
    },
    [goBack],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Array<EmojiItem>>) => (
      <EmojiPickerRow
        row={item}
        onSelect={onSelectEmoji}
        cellStyle={styles.cell}
        rowStyle={styles.row}
      />
    ),
    [onSelectEmoji, styles.cell, styles.row],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<Array<EmojiItem>> | null | undefined, index: number) => ({
      length: EMOJI_ROW_HEIGHT,
      offset: EMOJI_ROW_HEIGHT * index,
      index,
    }),
    [],
  );

  const keyExtractor = useCallback(
    (row: Array<EmojiItem>) =>
      row.map(({ id }) => id).join('-') || 'emoji-row-empty',
    [],
  );

  const header = ios ? (
    <ModalHeader
      title={t('Emoji')}
      left={<HeaderItem label={t('Cancel')} left onPressItem={goBack} />}
    />
  ) : (
    <CustomHeader title={t('Emoji')} noShadow />
  );

  return (
    <SafeAreaView style={styles.container}>
      {header}

      <View style={styles.bodyContainer}>
        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(generateSlug(value));
          }}
          placeholder={t('Search for ...')}
          style={styles.textInput}
          testID="EmojiPicker:TextInput:Search"
        />
        {showList ? (
          <FlatList
            data={emojiRows}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            initialNumToRender={12}
            maxToRenderPerBatch={8}
            windowSize={5}
            updateCellsBatchingPeriod={50}
            keyboardShouldPersistTaps="handled"
            style={styles.list}
          />
        ) : (
          <View style={styles.list} />
        )}
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ spacing, colors }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  textInput: {
    marginBottom: spacing.m,
  },
  row: {
    flexDirection: 'row',
    height: EMOJI_ROW_HEIGHT,
  },
  cell: {
    flex: 1,
    height: EMOJI_ROW_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.m,
  },
  list: {
    flex: 1,
  },
}));
