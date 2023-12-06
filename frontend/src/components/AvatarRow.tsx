import React from 'react';
import {
  ImageStyle,
  StyleProp,
  TextStyle,
  View,
  ViewProps,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import { Avatar, AvatarProps, Text } from '../core-ui';
import { makeStyles } from '../theme';
import { User, StackNavProp } from '../types';

type Props = ViewProps &
  Pick<AvatarProps, 'size'> & {
    posters: Array<User>;
    title: string;
    titleStyle?: StyleProp<TextStyle>;
    imageStyle?: StyleProp<ImageStyle>;
    extended?: boolean;
  };

export function AvatarRow(props: Props) {
  const { navigate } = useNavigation<StackNavProp<'TabNav'>>();
  const styles = useStyles();

  const {
    posters,
    title,
    size = 'xs',
    titleStyle,
    imageStyle,
    style,
    extended,
    ...otherProps
  } = props;

  const onPressAvatar = (username: string) => {
    navigate('UserInformation', { username });
  };

  return (
    <View style={[styles.container, style]} {...otherProps}>
      <Text
        color="textLight"
        numberOfLines={1}
        style={[styles.title, titleStyle]}
      >
        {title}
      </Text>
      {extended ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.avatarContainerScroll}
          contentContainerStyle={styles.scrollViewContentContainer}
          bounces={false}
        >
          {posters.map((item, index) => (
            <Avatar
              key={`poster-extended-${item.id}`}
              src={item.avatar}
              size={size}
              label={item.username[0]}
              style={[
                imageStyle,
                index !== posters.length - 1 ? styles.spacing : null,
              ]}
              onPress={() => onPressAvatar(item.username)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.avatarContainer}>
          {posters.slice(0, 5).map((item, index) => (
            <Avatar
              key={`poster-${item.id}`}
              src={item.avatar}
              size={size}
              label={item.username[0]}
              style={[
                imageStyle,
                index !== posters.length - 1 ? styles.spacing : null,
              ]}
              onPress={() => onPressAvatar(item.username)}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  avatarContainerScroll: {
    width: 30,
  },
  scrollViewContentContainer: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  title: {
    flex: 2,
  },
  spacing: {
    marginEnd: spacing.m,
  },
}));
