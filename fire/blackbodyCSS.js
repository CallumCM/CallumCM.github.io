document.addEventListener('DOMContentLoaded', async () => {

  
  function parseTemperature(tempString) {
    if (!tempString) return null;

    // Custom properties can have leading/trailing whitespace
    const trimmedString = tempString.trim();
    const value = parseFloat(trimmedString);
    if (isNaN(value)) return null;

    const unit = trimmedString.slice(-1).toUpperCase();

    switch (unit) {
      case 'K':
        return value;
      case 'C':
        return value + 273.15;
      case 'F':
        return (value - 32) * 5 / 9 + 273.15;
      default:
        // If there's no unit, default to Kelvin
        if (String(value) === trimmedString) {
          return value;
        }
        return null;
    }
  }


  function processStyleDeclaration(style) {
    // CSS styles in JavaScript are NOT just Arrays so we gotta use a for loop + index instead of something silly like forEach
    for (let i = 0; i < style.length; i++) {
      const propName = style[i];

      // Look for custom properties starting with --temp-
      if (propName.startsWith('--temp-')) {
        const value = style.getPropertyValue(propName);
        const realPropName = propName.substring(7); // Remove the --temp-

        const temperature = parseTemperature(value);
        if (temperature === null) {
          console.warn(`Invalid blackbody temperature: ${value}`, style);
          continue;
        }

        if (typeof BlackBody === 'undefined' || typeof BlackBody.temperatureToRgb !== 'function') {
          if (!window.blackBodyWarningIssued) {
            console.error("BlackBody.temperatureToRgb() is not defined. Load blackbody.js first.");
            window.blackBodyWarningIssued = true;
          }
          return;
        }

        const rgb = BlackBody.temperatureToRgb(temperature);

        const priority = style.getPropertyPriority(propName); // Keep !important if it's there
        const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        style.setProperty(realPropName, rgbString, priority);
      }
    }
  }

  function processCssRule(rule) {
    if (rule.style) {
      processStyleDeclaration(rule.style);
    } else if (rule.cssRules) {

      // For grouping rules like @media
      Array.from(rule.cssRules).forEach(processCssRule);
    }
  }

  function runPolyfill() {
    try {
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(processCssRule);
          } else {
            console.warn(`CSS rules not immediately available for: ${sheet.href}.`);
          }
        } catch (e) {
          console.warn(`Could not access CSS rules from: ${sheet.href}.`, e.message);
        }
      });
    } catch (e) {
      console.error("Error processing stylesheets:", e);
    }

    try {
      // Look for inline styles containing --temp-
      const elementsWithInlineTemp = document.querySelectorAll('[style*="--temp-"]');
      elementsWithInlineTemp.forEach(el => {
        processStyleDeclaration(el.style);
      });
    } catch (e) {
      console.error("Error processing inline styles:", e);
    }
  }

  runPolyfill();

  // Handle DOM changes that occur after the page loads
  const observer = new MutationObserver((mutations) => {
    let needsReprocessing = false;
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        // An inline style was changed
        if (mutation.target.style.cssText.includes('--temp-')) {
          processStyleDeclaration(mutation.target.style);
        }
      } else if (mutation.type === 'childList') {
        for (const node of mutation.addedNodes) {
          // If a new stylesheet is added we gotta rerun everything
          if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'STYLE' || (node.tagName === 'LINK' && node.rel === 'stylesheet'))) {
            needsReprocessing = true;
            break;
          }

          // If the new element has inline style we need to process it
          if (node.nodeType === Node.ELEMENT_NODE && node.hasAttribute('style') && node.getAttribute('style').includes('--temp-')) {
            processStyleDeclaration(node.style);
          }
          // We need to do the same for the element's descendants
          if (node.nodeType === Node.ELEMENT_NODE && typeof node.querySelectorAll === 'function') {
            node.querySelectorAll('[style*="--temp-"]').forEach(el => {
              processStyleDeclaration(el.style);
            });
          }
        }
      }
      if (needsReprocessing) break;
    }

    if (needsReprocessing) {
      // Wait to allow new stylesheets to load
      // I know I know this is not great
      setTimeout(runPolyfill, 100);
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['style']
  });

});