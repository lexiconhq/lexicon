import React from 'react';
import { TouchableOpacityProps } from 'react-native';

import { Author } from '../../../components';
import { Divider, Icon } from '../../../core-ui';
import { makeStyles, useTheme } from '../../../theme';

type Props = TouchableOpacityProps & {
  avatar: string;
  name: string;
  username: string;
  isCheck: boolean;
  onSelectedUser: (username: string) => void;
};

export default function UserItem(props: Props) {
  const styles = useStyles();
  const { colors } = useTheme();

  const { avatar, name, username, isCheck, onSelectedUser } = props;

  return (
    <>
      <Author
        style={styles.container}
        onPressAuthor={() => onSelectedUser(username)}
        image={avatar}
        imageStyle={styles.image}
        size="m"
        title={name}
        titleStyle={[
          styles.name,
          { color: isCheck ? colors.primary : colors.textNormal },
        ]}
        variant="semiBold"
        subtitle={username}
        children={
          isCheck ? <Icon name="CheckCircle" style={styles.icon} /> : undefined
        }
      />
      <Divider style={styles.divider} />
    </>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.background,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xxl,
    alignItems: 'center',
  },
  image: {
    marginRight: spacing.xl,
  },
  name: {
    paddingBottom: spacing.s,
  },
  icon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  divider: {
    marginHorizontal: spacing.xxl,
  },
}));
