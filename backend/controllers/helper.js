const DOMParser = require('xmldom').DOMParser;
const tj = require('@mapbox/togeojson');
const fs = require('fs');

const getRoute = async(file) => {
  const gpx = new DOMParser().parseFromString(fs.readFileSync(file, 'utf8'));
  const converted = tj.gpx(gpx);

  const coord = converted.features[0].geometry.coordinates;

  for (let i = 0; i < coord.length; i++) {
    coord[i].pop();
    [coord[i][0], coord[i][1]] = [coord[i][1], coord[i][0]];
  }
  
  return coord;
}

exports.getRoute = getRoute;