// Thank goodness for Philips Hue SDK
// https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/00187a3db88dedd640f5ddfa8a474458dff4e1db/ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
// Also thanks to https://github.com/usolved/cie-rgb-converter

/**
* Converts CIE color space to RGB color space
* @param {Number} x
* @param {Number} y
* @param {Number} brightness from 1 to 254
* @return {Array} Color values for red, green and blue
*/
export function cie_to_rgb(x, y, brightness) {
  if (brightness === undefined) {
    brightness = 254;
  }

  const z = 1.0 - x - y;
  const Y = brightness / 254;

  // division by zero is bad
  // we hate wheel algebra
  if (y < 1e-6) {
    return [0, 0, 0];
  }

  const X = (Y / y) * x;
  const Z = (Y / y) * z;

  // Convert to RGB using Wide RGB D65 conversion
  // stolen from Philips Hue doc
  let red   = X * 1.4628067 - Y * 0.1840623 - Z * 0.2743606;
  let green = -X * 0.5217933 + Y * 1.4472381 + Z * 0.0677227;
  let blue  = X * 0.0349342 - Y * 0.0968930 + Z * 1.2884099;

  // turns out you cant render colors that are 110% blue
  // so we gotta cap everything at 1
  if (red > blue && red > green && red > 1.0) {
    green = green / red;
    blue = blue / red;
    red = 1.0;
  } else if (green > blue && green > red && green > 1.0) {
    red = red / green;
    blue = blue / green;
    green = 1.0;
  } else if (blue > red && blue > green && blue > 1.0) {
    red = red / blue;
    green = green / blue;
    blue = 1.0;
  }

  // Reverse gamma correction
  red   = red <= 0.0031308 ? 12.92 * red : (1.0 + 0.055) * Math.pow(red, (1.0 / 2.4)) - 0.055;
  green = green <= 0.0031308 ? 12.92 * green : (1.0 + 0.055) * Math.pow(green, (1.0 / 2.4)) - 0.055;
  blue  = blue <= 0.0031308 ? 12.92 * blue : (1.0 + 0.055) * Math.pow(blue, (1.0 / 2.4)) - 0.055;

  red   = Math.round(red * 255);
  green = Math.round(green * 255);
  blue  = Math.round(blue * 255);

  const clamp = (val) => Math.max(0, Math.min(255, val || 0));

  return [clamp(red), clamp(green), clamp(blue)];
}