const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');
const processing = require('./processing');
const app = express()

require('dotenv').config();

const apiKey = process.env.API_KEY

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  // res.send('Hello World!')
  res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: null});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  request(url, function (err, response, body) {
      if(err){
        res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        if(weather.main == undefined){
          res.render('home', {city: null, icon: null, temp: null, status: null, desc: null, feelsLike: null, humidity: null, wind: null, error: 'Error, please try again'});
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
          res.render('home', {city: city, icon: weatherIcon,  temp: temp, status: status, desc: desc, feelsLike: feelsLike, humidity: humidity, wind: wind, error: null});
        }
      }
    });
  })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})