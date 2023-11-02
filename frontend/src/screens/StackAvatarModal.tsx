import React from 'react';
import { View, Platform, SafeAreaView, FlatList } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { CustomHeader, HeaderItem, ModalHeader } from '../components';
import { makeStyles } from '../theme';
import { Avatar, Divider, Text } from '../core-ui';
import { RootStackNavProp, StackAvatarUser, StackRouteProp } from '../types';

export default function StackAvatarModal() {
  const ios = Platform.OS === 'ios';
  const styles = useStyles();
  const navigation = useNavigation<RootStackNavProp<'StackAvatar'>>();
  const {
    params: { option, users, amountVote },
  } = useRoute<StackRouteProp<'StackAvatar'>>();

  const Header = () =>
    ios ? (
      <ModalHeader
        title={option}
        right={
          <HeaderItem
            label={t('Done')}
            onPressItem={() => navigation.goBack()}
          />
        }
        style={styles.modalHeader}
      />
    ) : (
      <CustomHeader title={option} noShadow />
    );

  const renderItem = ({ item }: { item: StackAvatarUser }) => {
    return (
      <>
        <View style={styles.containerItem}>
          <Avatar
            style={styles.avatar}
            src={item.avatar}
            label={item.username[0]}
            size="m"
          />
          <View>
            <Text variant="semiBold" style={styles.name}>
              {item.name}
            </Text>
            <Text color="lightTextDarker">{item.username}</Text>
          </View>
        </View>
        <Divider style={styles.separator} />
      </>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header />
        <Text size="s" color="lightTextDarker">
          {amountVote > 1
            ? t(`{number} voters`, { number: amountVote })
            : t(`{number} voter`, { number: amountVote })}
        </Text>
      </View>
      <FlatList
        data={users}
        style={styles.listContainer}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalHeader: {
    paddingBottom: 0,
  },
  headerContainer: { alignItems: 'center' },
  listContainer: {
    paddingHorizontal: spacing.xxl,
    marginTop: spacing.xxl,
  },
  avatar: {
    marginRight: spacing.xl,
  },
  containerItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  name: {
    marginBottom: spacing.s,
  },
  separator: {
    marginBottom: spacing.xl,
  },
}));
