var weatherApiKey = require('./../.env').weatherApiKey;

exports.getWeather = function(latLng) {
  var lat = latLng.lat();
  var lng = latLng.lng();

  $.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon='+ lng +'&appid=' + weatherApiKey, function(response) {
    $('#weather').text('Currently, the weather is ' + response.weather[0].description);
    console.log(response.weather[0].description);
    $('#temperature').text(Math.floor(response.main.temp * 9/5 - 459.67) + " degrees fahrenheit");
  });

};
