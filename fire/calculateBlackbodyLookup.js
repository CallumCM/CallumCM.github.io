function generateLookupTable(fromTemp, toTemp, step) {
  const lookupTable = {};

  for (let temp = fromTemp; temp <= toTemp; temp += step) {
    const color = BlackBody.temperatureToRgb(temp);
    color.r = Math.round(color.r);
    color.g = Math.round(color.g);
    color.b = Math.round(color.b);

    lookupTable[temp] = color;
  }
  return lookupTable;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

download("blackbody-lookup.json", JSON.stringify(generateLookupTable(1000, 8000, 1)));