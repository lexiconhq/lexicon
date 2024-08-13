import { TextStyle, ViewStyle } from 'react-native';

type HeaderTitleAlign = 'center' | 'left' | undefined;

export type NavHeader = {
  headerStyle: ViewStyle;
  headerTintColor: string;
  headerTitleStyle: TextStyle;
  headerTitleAlign?: HeaderTitleAlign;
  headerBackTitleStyle: TextStyle;
  headerBackTitle: string;
};
