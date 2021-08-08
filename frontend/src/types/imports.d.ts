declare module '*.jpg';
declare module '*.png';

declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const Component: React.FC<SvgProps>;
  export default Component;
}

declare module '@env' {
  export const MOBILE_PROSE_HOST: string;
  export const MOBILE_PROSE_PORT: number;
}
