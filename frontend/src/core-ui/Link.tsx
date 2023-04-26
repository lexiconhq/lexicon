import React from 'react';
import * as Linking from 'expo-linking';

import { makeStyles } from '../theme';

import { Text } from './Text';

type Props = {
  url: string;
};

export let Link = ({ url }: Props) => {
  let styles = useStyles();
  return (
    <Text
      onPress={() => {
        Linking.openURL(url);
      }}
      style={styles.link}
    >
      {url}
    </Text>
  );
};

let useStyles = makeStyles(({ colors }) => ({
  link: {
    color: colors.activeTab,
  },
}));
