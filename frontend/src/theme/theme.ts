import { TransitionPresets } from '@react-navigation/stack';

import {
  FONT_SIZES,
  FONT_VARIANTS,
  FUNCTIONAL_COLORS,
  HEADING_FONT_SIZES,
  ICON_SIZES,
  SPACING,
} from '../constants';

// This is information about the device or system, which the theme might depend
// on, such as light/dark mode.
export type Config = {
  colorScheme: 'light' | 'dark' | 'no-preference';
  aesthetic: 'ios' | 'android';
};

function colorTheme(isDarkMode: boolean) {
  return {
    ...FUNCTIONAL_COLORS,
    textNormal: isDarkMode
      ? FUNCTIONAL_COLORS.darkTextNormal
      : FUNCTIONAL_COLORS.lightTextNormal,
    textLight: isDarkMode
      ? FUNCTIONAL_COLORS.darkTextLighter
      : FUNCTIONAL_COLORS.lightTextDarker,
    textLighter: isDarkMode
      ? FUNCTIONAL_COLORS.darkTextLightest
      : FUNCTIONAL_COLORS.lightTextDarkest,
    background: isDarkMode
      ? FUNCTIONAL_COLORS.darkBackground
      : FUNCTIONAL_COLORS.lightBackground,
    backgroundDarker: isDarkMode
      ? FUNCTIONAL_COLORS.darkBackgroundLighter
      : FUNCTIONAL_COLORS.lightBackgroundDarker,
    headerCap: isDarkMode
      ? FUNCTIONAL_COLORS.darkHeaderCap
      : FUNCTIONAL_COLORS.lightHeaderCap,
    actionSheetBackground: isDarkMode
      ? FUNCTIONAL_COLORS.darkActionSheetBackground
      : FUNCTIONAL_COLORS.lightActionSheetBackground,
    border: isDarkMode
      ? FUNCTIONAL_COLORS.darkBorder
      : FUNCTIONAL_COLORS.lightBorder,
    transparentBackground: isDarkMode
      ? FUNCTIONAL_COLORS.darkTransparentBackground
      : FUNCTIONAL_COLORS.lightTransparentBackground,
    toastBackground: isDarkMode
      ? FUNCTIONAL_COLORS.lightBackground
      : FUNCTIONAL_COLORS.darkBackground,
    toastText: isDarkMode
      ? FUNCTIONAL_COLORS.darkBackground
      : FUNCTIONAL_COLORS.lightBackground,
    toastInfoText: isDarkMode
      ? FUNCTIONAL_COLORS.darkTextLighter
      : FUNCTIONAL_COLORS.lightTextDarker,
  };
}

function shadowStyle(isDarkMode: boolean) {
  return {
    shadowColor: FUNCTIONAL_COLORS.shadow,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: isDarkMode ? 0.6 : 0.08,
    elevation: 2,
  };
}

export const getTheme = ({ colorScheme, aesthetic }: Config) => {
  const isDarkMode = colorScheme === 'dark';
  if (aesthetic === 'android') {
    FONT_VARIANTS.semiBold = FONT_VARIANTS.bold;
  }
  const colors = colorTheme(isDarkMode);

  return {
    colors,
    fontSizes: FONT_SIZES,
    iconSizes: ICON_SIZES,
    spacing: SPACING,
    fontVariants: FONT_VARIANTS,
    headingFontSizes: HEADING_FONT_SIZES,
    shadow: shadowStyle(isDarkMode),
    navHeader: {
      headerStyle: {
        backgroundColor: colors.background,
      },
      headerTintColor: colors.primary,
      headerTitleStyle: {
        color: colors.textNormal,
        fontSize: FONT_SIZES.l,
      },
      headerTitleAlign: 'center',
      headerBackTitleStyle: {
        color: colors.primary,
        fontSize: FONT_SIZES.m,
      },
      headerBackTitle: t('Back'),
    } as const,
    navModal:
      aesthetic === 'ios' &&
      ({
        headerShown: false,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
      } as const),
    navNoShadow: {
      headerStyle: {
        shadowOpacity: 0,
        elevation: 0,
        backgroundColor: colors.background,
      },
    },
  };
};

export type Theme = ReturnType<typeof getTheme>;
export type FontSize = keyof typeof FONT_SIZES;
export type FontVariant = keyof typeof FONT_VARIANTS;
export type IconSize = keyof typeof ICON_SIZES;
export type Spacing = keyof typeof SPACING;
export type Color = keyof ReturnType<typeof colorTheme>;
