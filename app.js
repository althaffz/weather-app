const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const api_key = "8c167268a15674e7b643046030455fa3";
const unit = "metric";


app.get('/', function(req, res){
  var city = "Toronto";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid="+api_key+"&units=" + unit;
  https.get(url, function(response){
    response.on('data', function(data){
      const weatherData = JSON.parse(data);

      var d = new Date();
      var time = ""+ d.getHours() +":"+d.getMinutes();
      var today = "" + d.getDate() +"/" + d.getMonth() +"/" + d.getFullYear();
      console.log(today);

      if (weatherData.cod == 200){
        var tempData = {
          _city: city,
          _time: time,
          _temp: weatherData.main.temp,
          _weather: weatherData.weather[0].description,
          _windSpeed: weatherData.wind.speed,
          _humidity: weatherData.main.humidity,
          _icon: weatherData.weather[0].icon,
          _today: today,
          _message: ""
        }

        res.render('weather', tempData);
      }
    });
  });
});



app.post('/', function(req, res){
  const city = req.body.city_name;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid="+api_key+"&units=" + unit;
  https.get(url, function(response){
    response.on('data', function(data){
      const weatherData = JSON.parse(data);

      var d = new Date();
      var localTime = d.getTime();
      var localOffset = d.getTimezoneOffset() * 60000;
      var utc = localTime + localOffset;
      var timezone = utc + (1000 * weatherData.timezone);

      var nd = new Date(timezone);
      var time = "" + nd.getHours() + ":" + nd.getMinutes();

      var today = "" + nd.getDate() +"/" + nd.getMonth() +"/" + nd.getFullYear();
      console.log(today);

      var message = "";

      if (weatherData.cod == 200){
        var tempData = {
          _city: city,
          _time: time,
          _temp: weatherData.main.temp,
          _weather: weatherData.weather[0].description,
          _windSpeed: weatherData.wind.speed,
          _humidity: weatherData.main.humidity,
          _icon: weatherData.weather[0].icon,
          _today: today,
          _message: message
        }

        res.render('weather', tempData);
      } else {
        res.redirect("/");
      }




      // res.write("<h1>The weather in " +city+ " is "+description+ "</h1>");
      // res.write("<p>Temperature is " +temperature+" degree Celcius</p>");
      // res.write("<img src=http://openweathermap.org/img/wn/" + weatherIcon+"@2x.png>");
      // res.send();
    });
  });
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server is up and running on port 3000");
});
