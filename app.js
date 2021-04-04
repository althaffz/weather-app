const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));

//const city = "London";
const api_key = "8c167268a15674e7b643046030455fa3";
const unit = "metric";





app.get('/', function(req, res){
  res.sendFile(__dirname + "/post.html");
});

app.post('/', function(req, res){
  const city = req.body.city;
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" +city+ "&appid="+api_key+"&units=" + unit;
  https.get(url, function(response){
    response.on('data', function(data){
      const weatherData = JSON.parse(data);

      const temperature = weatherData.main.temp;
      const description = weatherData.weather[0].description;
      const weatherIcon = weatherData.weather[0].icon;
      const windSpeed = weatherData.wind.speed;
      const humidity = weatherData.main.humidity;

      res.write("<h1>The weather in " +city+ " is "+description+ "</h1>");
      res.write("<p>Temperature is " +temperature+" degree Celcius</p>");
      res.write("<img src=http://openweathermap.org/img/wn/" + weatherIcon+"@2x.png>");
      res.send();
    });
  });
});


app.listen(3000, function(){
  console.log("Server is up and running on port 3000");
});
