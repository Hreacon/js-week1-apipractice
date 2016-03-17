var maps = require('./../js/modules/googleMap.js');
var mapsApi = require('./../.env').apiKey:

$.getScript("https://maps.googleapis.com/maps/api/js?key=" + mapsApi + "", function(){

   console.log("Maps loaded");

});

$( document ).ready(function() {
  maps.locateUser();
  $('#locateUser').click(maps.locateUser);
});
