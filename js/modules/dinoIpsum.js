exports.warning = function() {
  $.get('http://dinoipsum.herokuapp.com/api/?format=text&words=1&paragraphs=1').done(function(response) {
    $('#city_name').append(" and watch out for <strong>" + response + "</strong>");
  });
};

exports.idealConditions = function() {
  $.get('http://dinoipsum.herokuapp.com/api/?format=text&words=1&paragraphs=1').done(function(response) {
    $('#humidity').append(", which is the right humidity for <strong>" + response + "</strong>");
  });
};
