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

let viewData = { city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: null, countries: constants.countries, states: constants.states }

app.get('/', function (req, res) {
  res.render('home', viewData);
})

app.post('/', function (req, res) {
    // let city = req.body.city
    // let state = req.body.state
    // let country = req.body.country
    // get city, state code, country code from user
    // do call based on city provided
    // return lat and long

    // use lat and long to call weather data


    // http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
    // let cityCall = `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=5&appid={apiKey}`
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
    // http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
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
    });
  })

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})