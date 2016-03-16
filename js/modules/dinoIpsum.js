exports.warning = function() {
  $.get('http://dinoipsum.herokuapp.com/api/?format=text&words=1&paragraphs=1').done(function(response) {
    console.log(response);
    $('#city_name').append(" and watch out for <strong>" + response + "</strong>");
  });
};
