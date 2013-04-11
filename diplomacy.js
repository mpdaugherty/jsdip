$(function(){
  $.get('maps/default.svg', function(data) {
    $(data).find('svg').appendTo($('#map'));
  });
});