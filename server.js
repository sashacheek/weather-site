const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const processing = require('./processing');
const constants = require('./constants');
const app = express()

require('dotenv').config();

const apiKey = process.env.API_KEY

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

// set viewData
var viewData = { city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: null, countries: constants.countries, states: constants.states }

// default page
app.get('/', function (req, res) {
  res.render('home', viewData);
})

app.post('/', async function (req, res) {
  // reset viewData
  var viewData = { city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: null, countries: constants.countries, states: constants.states }

    let city = req.body.city
    let state = req.body.state
    let country = req.body.country

    var location;

    if (state == "") {
      location = await convertCityToCoordinates(city, country, res)

    } else {
      location = await convertCityStateToCoordinates(city, state, country , res)
    }

    if (location == "Error, please try again") {
      viewData.error = location;
      res.render('home', viewData);
    }

    else {

    lat = location[0].lat;
    lon = location[0].lon;

    // use lat and long to call weather data
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`

  request(url, function (err, response, body) {

      // if request fails
      if(err){
        viewData.error = "Error, please try again"
        res.render('home', viewData);

      } else {
        let weather = JSON.parse(body)

        // if no result for location found
        if(weather.main == undefined){
          viewData.error = "Error, please try again"
          res.render('home', viewData);

          // if successful
          } else {
          let weatherId = weather.weather[0].main;
          viewData.icon = processing.processIcon(weatherId);
          viewData.city = weather.name;
          viewData.temp = weather.main.temp;
          viewData.status = weather.weather[0].main;
          viewData.desc = weather.weather[0].description;
          viewData.feelsLike = weather.main.feels_like;
          viewData.humidity = weather.main.humidity;
          viewData.wind = weather.wind.speed;
          res.render('home', viewData);
        }
      }
    })};
  })

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})

async function convertCityToCoordinates(city, country) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${country}&limit=1&appid=${apiKey}`;
  try {
    const location = await getCoordsResponse(url);
    return location;
  } catch (error) {
    return error;
  }
}

async function convertCityStateToCoordinates(city, state, country) {
  let url = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&limit=1&appid=${apiKey}`;
  try {
    const location = await getCoordsResponse(url);
    return location;
  } catch (error) {
    return error;
  }

}

function getCoordsResponse(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      if (err) {
        // Reject the promise if there's an error with the request
        return reject("Error, please try again");
      }

      try {
        const location = JSON.parse(body);

        if (location == undefined) {
          return reject("Error, please try again");
        }

        else if (location[0] == undefined) {
          return reject("Error, please try again");
        }

        resolve(location);
      } catch (parseError) {
        reject("Error, please try again");
      }
    });
  });
}

