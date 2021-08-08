import React from 'react';
import ParsedText from 'react-native-parsed-text';

import { makeStyles } from '../theme';

type Props = {
  textValue: string;
};

export function MentionedText(props: Props) {
  const styles = useStyles();

  const { textValue } = props;

  return (
    <ParsedText
      parse={[
        {
          pattern: /@[A-Za-z0-9._-]*/g,
          style: styles.parsedText,
        },
      ]}
    >
      {textValue}
    </ParsedText>
  );
}

const useStyles = makeStyles(({ colors, fontVariants }) => ({
  parsedText: {
    color: colors.primary,
    ...fontVariants.bold,
  },
}));
