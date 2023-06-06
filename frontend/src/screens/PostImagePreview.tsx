import React from 'react';
import { ImageBackground, Platform, SafeAreaView, View } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

import { Icon } from '../core-ui';
import { makeStyles, useTheme } from '../theme';
import { RootStackNavProp, RootStackRouteProp } from '../types';

const ios = Platform.OS === 'ios';

export default function PostImagePreview() {
  const styles = useStyles();
  const { colors } = useTheme();

  const { navigate, goBack } =
    useNavigation<RootStackNavProp<'PostImagePreview'>>();

  const {
    params: { imageUri, prevScreen, title },
  } = useRoute<RootStackRouteProp<'PostImagePreview'>>();

  const uploading = () => {
    navigate(prevScreen, { imageUri, title });
  };

  return (
    <View style={styles.container}>
      <StatusBar style={'light'} />
      <SafeAreaView style={styles.fullContainer}>
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="contain"
          style={styles.fullContainer}
        >
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Icon
              name="Close"
              color={colors.pureWhite}
              onPress={goBack}
              style={styles.iconContainer}
            />
            <Icon
              name="Add"
              color={colors.pureWhite}
              onPress={uploading}
              style={styles.iconContainer}
            />
          </View>
        </ImageBackground>
      </SafeAreaView>
    </View>
  );
}

const useStyles = makeStyles(({ colors, spacing }) => ({
  container: {
    flexGrow: 1,
    backgroundColor: colors.pureBlack,
    paddingTop: ios ? 0 : Constants.statusBarHeight,
  },
  fullContainer: {
    flexGrow: 1,
  },
  iconContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.m,
  },
}));
