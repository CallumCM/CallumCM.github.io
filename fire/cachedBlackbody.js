/**
 * Black Body Radiation Calculator
 * 
 * Ported from C to JS from https://github.com/igarfieldi/black-body-calculator
 * 
 * This file uses a lookup table from calculateBlackbodyLookup.js
 * Because blackbody radiation is complicated
 */

(async function() {
  try {
    const response = await fetch('fire/blackbody-lookup.json');
    const blackbodyLookup = await response.json();

    /**
     * Converts temperature to RGB color
     * @param {number} temperature - Temperature in Kelvin
     * @returns {Object} RGB color {r, g, b}
     */
    function temperatureToRgb(temperature) {
      if (temperature < 1000 || temperature > 8000) {
        throw new Error('Temperature must be between 1000K and 8000K when using the blackbody lookup table. To use temperatures outside of this range, you must use the blackbody.js library to calculate the values.');
      }

      // The blackbody-lookup.json includes values every 1 degree Kelvin from 1k-8k degrees. If you'd like to generate a different lookup table use calculateBlackbodyLookup.js, or if you want to calculate the values without a lookup table use blackbody.js
      const closestTemperature = Math.min(8000, Math.max(1000, Math.round(temperature)));
      return blackbodyLookup[closestTemperature];
    }

    const BlackBody = {
      // Core functions
      temperatureToRgb,
    };

    window.BlackBody = BlackBody;

    document.dispatchEvent(new Event('blackbodyLoaded'));
  } catch (error) {
    console.error('Error loading blackbody lookup:', error);
  }
})();
