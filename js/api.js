var weatherApiKey = require('./../.env').weatherApiKey;
var dino = require('./../js/modules/dinoIpsum.js');

exports.getWeather = function(latLng) {
  var lat = latLng.lat();
  var lng = latLng.lng();

  $.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon='+ lng +'&appid=' + weatherApiKey, function(response) {
    $('#city_name').text('The closest city is ' + response.name);
    $('#humidity').text('The humidity is  ' + response.main.humidity);
    $('#weather').text('Currently, the weather is ' + response.weather[0].description);
    // console.log(JSON.stringify(response));
    $('#temperature').text('The temperature is ranging from ' + Math.floor(response.main.temp_min * 9/5 - 459.67) + ' to ' + Math.floor(response.main.temp_max * 9/5 - 459.67) + " degrees fahrenheit");
    var getDinos = $.get('http://dinoipsum.herokuapp.com/api/?format=text&words=1&paragraphs=1').done(function(response) {
      console.log(response);
      $('#city_name').append(" and watch out for " + response);
    });
  });

};
