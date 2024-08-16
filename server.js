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
  res.render('home', {weather: null, icon: null, error: ''});
})

app.post('/', function (req, res) {
    let city = req.body.city;
    let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`
  request(url, function (err, response, body) {
      if(err){
        res.render('home', {weather: null, icon: null, error: 'Error, please try again'});
      } else {
        let weather = JSON.parse(body)
        if(weather.main == undefined){
          res.render('home', {weather: null, icon: null, error: 'Error, please try again'});
        } else {
          let weatherId = weather.weather[0].main;
          let weatherIcon = processing.processIcon(weatherId);
          // get weather main id
          // send to processing
          // processing determines which image to render based on given id
          // send image src here
          let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
          res.render('home', {weather: weatherText, icon: weatherIcon, error: null});
        }
      }
    });
  })

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})