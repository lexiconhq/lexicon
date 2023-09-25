import React from 'react';

import CachedImage from '../core-ui/CachedImage';
import { makeStyles } from '../theme';

type Props = {
  show: boolean;
  userImage: { uri: string };
  onPressCancel: () => void;
};

export function ShowImageModal(props: Props) {
  const styles = useStyles();

  const { show, userImage, onPressCancel } = props;

  return (
    <CachedImage
      isBackground
      source={userImage}
      style={styles.imageDetail}
      visible={show}
      setVisible={onPressCancel}
    />
  );
}

const useStyles = makeStyles(() => ({
  imageDetail: {
    flexGrow: 1,
  },
}));
