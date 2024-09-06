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

app.get('/', function (req, res) {
  res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: null, countries: constants.countries});
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
      if(err){
        res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: 'Error, please try again', countries: constants.countries});
      } else {
        let weather = JSON.parse(body)
        if(weather.main == undefined){
          res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: 'Error, please try again', countries: constants.countries});
        } else {
          // weather icon
          let weatherId = weather.weather[0].main;
          let weatherIcon = processing.processIcon(weatherId);
          // weather city
          let city = weather.name;
          // weather temp
          let temp = weather.main.temp;
          let status = weather.weather[0].main;
          let desc = weather.weather[0].description;
          let feelsLike = weather.main.feels_like;
          let humidity = weather.main.humidity;
          let wind = weather.wind.speed;
          res.render('home', {city: city, icon: weatherIcon,  temp: temp, status: status, desc: desc, feelsLike: feelsLike, humidity: humidity, wind: wind, error: null, countries: constants.countries});
        }
      }
    });
  })

app.listen(3000, function () {
  console.log('Weather app listening on port 3000!')
})