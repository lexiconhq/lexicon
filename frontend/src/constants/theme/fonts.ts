import { TextStyle } from 'react-native';

type FontVariants = Record<string, TextStyle>;

export const FONT_VARIANTS: FontVariants = {
  normal: { fontWeight: '400' },
  semiBold: { fontWeight: '600' },
  bold: { fontWeight: '700' },
};

export const FONT_SIZES = {
  xxxl: 64,
  xxl: 40,
  xl: 24,
  l: 18,
  m: 16,
  s: 14,
  xs: 12,
};

export const HEADING_FONT_SIZES = {
  h1: 32,
  h2: 24,
  h3: 22,
  h4: 20,
  h5: 18,
  h6: 17,
};
