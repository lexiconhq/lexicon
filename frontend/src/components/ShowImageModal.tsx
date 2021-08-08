import React from 'react';
import { Modal, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

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
    <Modal
      visible={show}
      presentationStyle="overFullScreen"
      transparent
      statusBarTranslucent
      onRequestClose={onPressCancel}
    >
      <View style={styles.modalContainer}>
        <StatusBar style={'light'} />
        <CachedImage
          isBackground
          source={userImage}
          style={styles.imageDetail}
          visible={show}
          setVisible={onPressCancel}
        />
      </View>
    </Modal>
  );
}

const useStyles = makeStyles(() => ({
  modalContainer: {
    flexGrow: 1,
  },
  imageDetail: {
    flexGrow: 1,
  },
}));
