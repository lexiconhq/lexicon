import React, { useEffect, useState } from 'react';
import { Platform, SafeAreaView, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';

import { Text, TextInput } from '../core-ui';
import { makeStyles } from '../theme';
import { EMOJI } from '../constants/emoji';
import { CustomHeader, HeaderItem, ModalHeader } from '../components';
import { RootStackNavProp } from '../types';
import { generateSlug } from '../helpers/generateSlug';

type EmojiRenderItem = {
  id: number;
  emoji: string;
  name: string;
};

export default function EmojiPicker() {
  const styles = useStyles();
  const navigation = useNavigation<RootStackNavProp<'EmojiPicker'>>();
  const { goBack } = navigation;
  const [emojis, setEmojis] = useState(EMOJI);
  const [query, setQuery] = useState('');
  const ios = Platform.OS === 'ios';

  useEffect(() => {
    const debounce = <T extends (args: string) => void>(
      func: T,
      delay: number,
    ) => {
      let timeoutId: NodeJS.Timeout;
      return (args: string) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(args);
        }, delay);
      };
    };

    const filterEmojis = (value: string) => {
      const filteredEmojis = EMOJI.filter(({ name }) => name.includes(value));
      setEmojis(filteredEmojis);
    };

    const debouncedFilterEmojis = debounce(filterEmojis, 800);

    debouncedFilterEmojis(query);
  }, [query]);

  const Header = () =>
    ios ? (
      <ModalHeader
        title={t('Emoji')}
        left={<HeaderItem label={t('Cancel')} left onPressItem={goBack} />}
      />
    ) : (
      <CustomHeader title={t('Emoji')} noShadow />
    );

  const renderItem = ({ item }: { item: EmojiRenderItem }) => {
    const { name, emoji } = item;
    const { navigate } = navigation;

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity
          onPress={() => {
            navigate('EditUserStatus', { emojiCode: name, emojiText: emoji });
          }}
          key={`emoji-${name}`}
          testID={`EmojiPicker:Button:Emoji:${name}`}
        >
          <Text size="xl">{emoji}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />

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
        {/* using flash list because it more faster than flatlist in this case to
        render more than 3000 emoji */}
        <FlashList
          data={emojis}
          renderItem={renderItem}
          keyExtractor={(item) => `emoji-${item.id}`}
          numColumns={6}
          estimatedItemSize={EMOJI.length}
          removeClippedSubviews={true}
        />
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
  itemContainer: {
    padding: spacing.m,
  },
  bodyContainer: {
    flex: 1,
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.m,
  },
}));
