const axios = require('axios');

const getReport = async (mapData) => {
  return getCovidStats().then((data) => {
    return combineData(mapData, data);
  });
};

const getTotalReport = async () => {
  const options = {
    method: 'GET',
    url: 'https://disease.sh/v3/covid-19/all',
  };

  return axios
    .request(options)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
};

const getCovidStats = async () => {
  var options = {
    method: 'GET',
    url: 'https://disease.sh/v3/covid-19/countries',
  };

  return axios
    .request(options)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
    });
};

const combineData = async (geoData, covidData) => {
  geoData.features.forEach((country) => {
    for (let covidRecord of covidData) {
      if (country.properties.iso_a2 === covidRecord.countryInfo.iso2) {
        country.properties.cases = covidRecord.cases;
        country.properties.deaths = covidRecord.deaths;
        country.properties.recovered = covidRecord.recovered;
        country.properties.active = covidRecord.active;
        country.properties.flag = covidRecord.countryInfo.flag;
      }
    }
  });
  return geoData;
};

export { getReport, getTotalReport };
