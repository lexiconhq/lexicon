import { ColorScheme } from '../../helpers';

export const FIXED_COLOR_SCHEME: ColorScheme = 'no-preference';

export const BASE_COLORS = {
  pureBlack: '#000000',
  black100: '#1A1A1A',
  black60: '#757575',
  black20: '#D1D1D1',
  grey: '#E8E8E8',
  blackSmoke: '#2D3034',
  slateGrey: '#1D2027',
  spaceGrey: '#15171A',
  neroGrey: '#222222',
  brownGrey: '#979797',
  pureWhite: '#FFFFFF',
  whiteSmoke: '#F2F2F2',
  pearlWhite: '#FAFAFA',
  lilyWhite: '#EEEFEE',
  transparentLilyWhite: 'rgba(238, 239, 238, 0.6)',
  transparentPureBlack: 'rgba(0, 0, 0, 0.6)',
  white100: '#FEFEFE',
  white60: '#ACAEB1',
  white20: '#5A5E63',
  royalBlue: '#2B6AFF',
  bittersweet: '#FD6565',
};

export const FUNCTIONAL_COLORS = {
  lightTextNormal: BASE_COLORS.black100,
  lightTextDarker: BASE_COLORS.black60,
  lightTextDarkest: BASE_COLORS.black20,
  lightBackground: BASE_COLORS.pureWhite,
  lightBackgroundDarker: BASE_COLORS.pearlWhite,
  lightHeaderCap: BASE_COLORS.brownGrey,
  lightActionSheetBackground: BASE_COLORS.lilyWhite,
  lightBorder: BASE_COLORS.whiteSmoke,
  lightTransparentBackground: BASE_COLORS.transparentLilyWhite,

  darkTextNormal: BASE_COLORS.white100,
  darkTextLighter: BASE_COLORS.white60,
  darkTextLightest: BASE_COLORS.white20,
  darkBackground: BASE_COLORS.slateGrey,
  darkBackgroundLighter: BASE_COLORS.spaceGrey,
  darkHeaderCap: BASE_COLORS.white60,
  darkActionSheetBackground: BASE_COLORS.neroGrey,
  darkBorder: BASE_COLORS.blackSmoke,
  darkTransparentBackground: BASE_COLORS.transparentPureBlack,

  shadow: BASE_COLORS.pureBlack,
  activeTab: BASE_COLORS.royalBlue,
  inactiveTab: BASE_COLORS.brownGrey,
  error: BASE_COLORS.bittersweet,
  liked: BASE_COLORS.bittersweet,

  primary: BASE_COLORS.royalBlue,

  grey: BASE_COLORS.grey,
  pureWhite: BASE_COLORS.pureWhite,
  pureBlack: BASE_COLORS.pureBlack,
};
