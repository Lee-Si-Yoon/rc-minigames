type RGB = { r: number; g: number; b: number };
type HexColors = { [key: string]: string };
type RGBColors = { [key: string]: RGB };

const tintColorHex: HexColors = {
  red_01: "#C90500",
  red_02: "#E00F0A",
  red_03: "#EA251F",
  red_04: "#E06666",
  red_05: "#F4CCCC",
};
const tintColorRGB: RGBColors = {
  red_01: { r: 201, g: 5, b: 0 },
  red_02: { r: 224, g: 15, b: 10 },
  red_03: { r: 234, g: 37, b: 31 },
  red_04: { r: 224, g: 102, b: 102 },
  red_05: { r: 244, g: 204, b: 204 },
};

const greyColorHex: HexColors = {
  black: "#000000",
  grey_01: "#171719",
  grey_02: "#303034",
  grey_03: "#404044",
  grey_04: "#79828E",
  grey_05: "#B0B8C1",
  white: "#FFFFFF",
};
const greyColorRGB: RGBColors = {
  black: { r: 0, g: 0, b: 0 },
  grey_01: { r: 23, g: 23, b: 25 },
  grey_02: { r: 48, g: 48, b: 52 },
  grey_03: { r: 64, g: 64, b: 68 },
  grey_04: { r: 121, g: 130, b: 142 },
  grey_05: { r: 176, g: 184, b: 193 },
  white: { r: 255, g: 255, b: 255 },
};

/**
 * @textColors
 * white -> grey_05 -> grey_04
 *
 * @borderColor
 * red_03 (point)
 * grey_03 -> grey_02
 */

interface RGBColor {
  R: number;
  G: number;
  B: number;
}

function parseRGBColor(rgbString: string | null): RGBColor | null {
  const regex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
  const match = rgbString?.match(regex);

  if (match) {
    const R = parseInt(match[1]);
    const G = parseInt(match[2]);
    const B = parseInt(match[3]);

    return { R, G, B };
  }

  return null;
}

function rgaToHex(rgb: RGB) {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}

export {
  tintColorHex,
  tintColorRGB,
  greyColorHex,
  greyColorRGB,
  parseRGBColor,
  rgaToHex,
  RGB,
};
