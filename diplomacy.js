$(function(){
  $.get('maps/default.svg', function(data) {
    var svg = $(data).find('svg');
    svg.appendTo($('#map'));
    var pathSelector = 'path.land:not(.unplayable),path.water:not(.unplayable)';
    svg.find('#MapLayer>g').mouseover(function(e) {
      $(this).find(pathSelector).each(function(i, e) {
        e.classList.add('highlighted');
      });
    }).mouseout(function(e) {
      $(this).find(pathSelector).each(function(i, e) {
        e.classList.remove('highlighted');
      });
    }).click(function(e) {
      $(this).find(pathSelector).each(function(i, e) {
        e.classList.toggle('selected');
      });
      if ($('.selected').length === 2) {
        var x = [];
        var y = [];
        $('.selected').each(function(i, e) {
          var el = $(this).parent().find('.unit:not(.dislodged)');
          x.push(el.attr('x'));
          y.push(el.attr('y'));
        });
        var z = $('<line x1="'+x[0]+'" y1="'+y[0]+'" x2="'+x[1]+'" y2="'+y[1]+'" stroke="green" stroke-width="2"/>');
        z.appendTo($('#MapLayer'));
        $('.selected').each(function(i, e) {
          e.classList.remove('selected');
        });
      }
    });
  });
});