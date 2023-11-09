var express = require('express');
var router = express.Router();
require('dotenv').config();
const axios = require('axios');

const apiKey = process.env.OPENTRIP_TOKEN;

const apiGet = (method, query) => {
  return new Promise(function (resolve, reject) {
    var otmAPI =
      'https://api.opentripmap.com/0.1/en/places/' +
      method +
      '?apikey=' +
      apiKey;
    if (query !== undefined) {
      otmAPI += '&' + query;
    }
    axios
      .get(otmAPI)
      .then((data) => resolve(data))
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  });
};

const getPlaces = async ({ body }, res) => {
  const { city } = body;
  try {
    if (!city) {
      return res
        .status(400)
        .send('All input is required, Example body => { city: "Paris" }');
    }

    const locationResponse = await apiGet('geoname', 'name=' + city);
    const radiusResponse = await apiGet(
      'radius',
      'radius=10000&lon=' +
        locationResponse.data.lon +
        '&lat=' +
        locationResponse.data.lat +
        '&format=json&limit=30'
    );
    return res.json({
      places: radiusResponse.data
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getDetails = async ({ body }, res) => {
  const { xid } = body;
  try {
    if (!xid) {
      return res
        .status(400)
        .send(
          'All input is required, Example body => { xid: "N191031796,Q3076270" }'
        );
    }
    const detailedResponse = await apiGet('xid/' + xid);
    return res.json({
      details: detailedResponse.data
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};

const getPlacesCoordinates = async ({ body }, res) => {
  const { points, filters } = body;
  try {
    if (!points) {
      return res
        .status(400)
        .send(
          'All input is required, Example body [lon, lat] => { points: [{ coordinates: ["N191031796","Q3076270"] }], filters: "amusements,cultural" }'
        );
    }
    var filterArray = filters.split(',');
    var filterString = '';
    const filterList = [
      'restaurants',
      'accomodations',
      'transport',
      'nightclubs',
      'bars',
      'amusements',
      'cultural',
      'sport'
    ];
    if (filters != '') {
      for (i in filterArray) {
        if (filterList.includes(filterArray[i])) {
          filterArray.push(filterArray[i]);
        }
      }
      filterString = filterArray.join(',');
    } else {
      filterString = filterList.join(',');
    }
    var response = [];
    for (i in points) {
      // console.log(i)
      try {
        var radiusResponse = await apiGet(
          'radius',
          'radius=10000&lon=' +
            points[i].coordinates[0] +
            '&lat=' +
            points[i].coordinates[1] +
            '&format=json&limit=1000' +
            (filterString != '' ? '&kinds=' + filterString : '')
        );
      } catch (e) {
        return res.status(500).send(e);
      }
      response.push(radiusResponse.data);
    }

    return res.json({
      places: response
    });
  } catch (e) {
    return res.status(500).send(e);
  }
};

router.post('/places', getPlaces);
router.post('/places/details', getDetails);
router.post('/places/coordinates', getPlacesCoordinates);

module.exports = router;
