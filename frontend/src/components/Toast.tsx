import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BaseToast, { ToastConfig } from 'react-native-toast-message';

import { makeStyles } from '../theme';
import { Icon } from '../core-ui/Icon';
import { IconName } from '../icons';

let toastConfig: ToastConfig = {
  noConnectionToast: ({ text1 = '', props }) => (
    <ToastItem {...props} mainText={text1} iconName="NoConnection" />
  ),
  unreachableToast: ({ text1, props }) => (
    <ToastItem {...props} mainText={text1} iconName="Unreachable" />
  ),
  requestFailedToast: ({ text1, props }) => (
    <ToastItem {...props} mainText={text1} iconName="Unreachable" />
  ),
  onlineToast: ({ text1, props }) => (
    <ToastItem {...props} mainText={text1} iconName="Online" />
  ),
};
export function Toast() {
  return <BaseToast config={toastConfig} />;
}

type ToastItemProps = {
  mainText: string;
  iconName: IconName;
  onMoreInfoPress?: () => void;
};

let ToastItem = ({ mainText, iconName, onMoreInfoPress }: ToastItemProps) => {
  let styles = useStyles();

  return (
    <View style={styles.toastContainer}>
      <Icon size="m" name={iconName} />
      <Text style={styles.mainText}>{mainText}</Text>
      {onMoreInfoPress ? (
        <TouchableOpacity onPress={onMoreInfoPress}>
          <Text style={styles.infoText}>More Info</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const useStyles = makeStyles(({ colors }) => ({
  toastContainer: {
    height: 36,
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    backgroundColor: colors.toastBackground,
    flexDirection: 'row',
  },
  mainText: {
    color: colors.toastText,
    marginLeft: 6,
    marginRight: 75,
  },
  infoText: {
    color: colors.toastInfoText,
  },
}));
