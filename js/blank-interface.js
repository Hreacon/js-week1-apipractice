var maps = require('./../js/modules/googleMap.js');


$( document ).ready(function() {
  $('#locateUser').click(maps.locateUser);
});
