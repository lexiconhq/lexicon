import { ColorScheme } from '../../helpers';

export const FIXED_COLOR_SCHEME: ColorScheme = 'no-preference';

export const BASE_COLORS = {
  pureBlack: '#000000',
  pureBlack40Opacity: '#00000066',
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
  darkerGray: '#E2E2E2',
  lightGray: '#F2F2F2',
  mustardYellow: '#CC9619',
  lightYellow: '#FAF4E7',
  red: '#FF6E6E',
  lightGreen: '#E7F4E9',
  green: '#4DAC5C',
  lightRed: '#FFEBEB',
  pinkRed: '#FD6565',
  lightBlue: '#E8EFFF',
  azureBlue10: '#2B6AFF1A',

  squidInk: '#262A31',
  approxBlackRussian: '#1C1F24',
  lightSilver: '#D8D8D8',

  pieChart1: '#FFB26F',
  pieChart2: '#76C8FC',
  pieChart3: '#EB98FF',
  pieChart4: '#FF8D8D',
  pieChart5: '#7ED321',
  pieChart6: '#FFD12A',
  pieChart7: '#6BD7E2',
  pieChart8: '#FFB3E3',
  pieChart9: '#A5B3FF',
  pieChart10: '#FFBB76',
  pieChart11: '#C6A5A5',
  pieChart12: '#8F8FFF',
  pieChart13: '#C5D36E',
  pieChart14: '#FF9B92',
  pieChart15: '#A4FFA6',
  pieChart16: '#FFDD93',
  pieChart17: '#6FD1CD',
  pieChart18: '#FFA25B',
  pieChart19: '#B3A5FF',
  pieChart20: '#FF7F7F',
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

  activeSideBarAndroid: BASE_COLORS.azureBlue10,

  primary: BASE_COLORS.royalBlue,
  success: BASE_COLORS.green,

  grey: BASE_COLORS.grey,
  pureWhite: BASE_COLORS.pureWhite,
  pureBlack: BASE_COLORS.pureBlack,

  backDrop: BASE_COLORS.pureBlack40Opacity,

  skeletonLoadingLightBackGround: BASE_COLORS.grey,
  skeletonLoadingLightHighlight: BASE_COLORS.lightSilver,

  skeletonLoadingDarkBackGround: BASE_COLORS.squidInk,
  skeletonLoadingDarkHighlight: BASE_COLORS.approxBlackRussian,

  warnText: BASE_COLORS.red,

  alertWarningBackground: BASE_COLORS.lightYellow,
  alertWarningText: BASE_COLORS.mustardYellow,
  alertSuccessBackground: BASE_COLORS.lightGreen,
  alertSuccessText: BASE_COLORS.green,
  alertErrorBackground: BASE_COLORS.lightRed,
  alertErrorText: BASE_COLORS.pinkRed,
  alertInfoBackground: BASE_COLORS.lightBlue,
  alertInfoText: BASE_COLORS.royalBlue,
};

// NOTE: Change this to a randeom color generator
export const PIE_CHART_COLORS = [
  BASE_COLORS.pieChart1,
  BASE_COLORS.pieChart2,
  BASE_COLORS.pieChart3,
  BASE_COLORS.pieChart4,
  BASE_COLORS.pieChart5,
  BASE_COLORS.pieChart6,
  BASE_COLORS.pieChart7,
  BASE_COLORS.pieChart8,
  BASE_COLORS.pieChart9,
  BASE_COLORS.pieChart10,
  BASE_COLORS.pieChart11,
  BASE_COLORS.pieChart12,
  BASE_COLORS.pieChart13,
  BASE_COLORS.pieChart14,
  BASE_COLORS.pieChart15,
  BASE_COLORS.pieChart16,
  BASE_COLORS.pieChart17,
  BASE_COLORS.pieChart18,
  BASE_COLORS.pieChart19,
  BASE_COLORS.pieChart20,
];
