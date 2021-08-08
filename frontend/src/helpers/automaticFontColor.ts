type HexToRgbResult = {
  isSuccess: boolean;
  rgb: Array<number>;
};

export function hexToRgb(color: string): HexToRgbResult {
  const isHex = color.startsWith('#');
  const hex = color.slice(1);

  if (isHex && hex.length < 7 && hex.length > 2) {
    let rgbHex;

    if (hex.length < 6) {
      rgbHex = [];
      rgbHex[0] = hex[0] + hex[0];
      rgbHex[1] = hex[1] + hex[1];
      rgbHex[2] = hex[2] + hex[2];
    } else {
      rgbHex = hex.match(/.{2}/g);
    }

    if (rgbHex) {
      return {
        isSuccess: true,
        rgb: [
          parseInt(rgbHex[0], 16),
          parseInt(rgbHex[1], 16),
          parseInt(rgbHex[2], 16),
        ],
      };
    }
  }

  return { isSuccess: false, rgb: [-1] };
}

function isColorDark(r: number, g: number, b: number) {
  const grayScaleLuminance = 0.299 * r + 0.587 * g + 0.114 * b;

  return grayScaleLuminance / 255 <= 0.5;
}

export function automaticFontColor(backgroundColor: string): 'black' | 'white' {
  const { isSuccess, rgb } = hexToRgb(backgroundColor);

  if (isSuccess) {
    const [r, g, b] = rgb;
    return isColorDark(r, g, b) ? 'white' : 'black';
  } else {
    return 'white';
  }
}
