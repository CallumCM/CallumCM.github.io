import { cie_to_rgb } from "./cie_rgb_converter.js";

// Equation taken from https://physics.stackexchange.com/questions/207654/what-would-the-rgb-color-value-of-an-infinitely-hot-blackbody-be
// This returns the intensity of the blackbody color at any given wavelength
function blackbodySpectrum(wavelength, temperature) {
  const h = 6.6261e-34; // Planck constant
  const c = 299792458; // Speed of light
  const k = 1.3806e-23; // Boltzmann constant

  const expPart = Math.exp((h * c) / (wavelength * k * temperature));
  const intensity = (2 * h * c ** 2) / (wavelength ** 5 * (expPart - 1));

  return intensity;
}

// This loops through visible wavelengths to create the full spectrum
function getCompleteBlackbodySpectrum(temperature, startWavelength = 380e-9, endWavelength = 750e-9, steps = 100) {
  const spectrum = [];
  const wavelengthStep = (endWavelength - startWavelength) / steps;

  for (let i = 0; i <= steps; i++) {
    const wavelength = startWavelength + (i * wavelengthStep);
    const intensity = blackbodySpectrum(wavelength, temperature);
    spectrum.push({
      wavelength: wavelength,
      intensity: intensity
    });
  }

  return spectrum;
}


function blackbodyRGB(temperature) {
  const spectrum = getCompleteBlackbodySpectrum(temperature, 380e-9, 750e-9, 100);

  let X = 0, Y = 0, Z = 0;

  spectrum.forEach(({ wavelength, intensity }) => {
    const lambda = wavelength * 1e9; // Meter to nanometer

    // CIE 1931 color matching functions
    const x_bar = Math.exp(-0.5 * Math.pow((lambda - 598.8) / 37.9, 2)) * 1.056 +
      Math.exp(-0.5 * Math.pow((lambda - 442.0) / 36.5, 2)) * 0.362;
    const y_bar = Math.exp(-0.5 * Math.pow((lambda - 568.8) / 46.9, 2)) * 0.821;
    const z_bar = Math.exp(-0.5 * Math.pow((lambda - 437.0) / 11.8, 2)) * 1.217;

    X += intensity * x_bar;
    Y += intensity * y_bar;
    Z += intensity * z_bar;
  });

  // Normalize cause intensity can be crazy sauce sometimes and we want it to all add to 1
  const sum = X + Y + Z;
  if (sum > 0) {
    const x = X / sum;
    const y = Y / sum;

    const rgb = cie_to_rgb(x, y, Math.min(254, Math.max(1, Y / Math.max(X, Y, Z) * 254)));

    return {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],
      rgb: `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    };
  }

  // uh oh something went wrong
  return { r: 0, g: 0, b: 0, rgb: 'rgb(0, 0, 0)' };
}

let blackbodyGradient = (new Array(10)).fill(0).map((_, index) => {
  500 + ((3500 - 500) / 9) * index
});