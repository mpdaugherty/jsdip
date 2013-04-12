$(function(){
  var svgns = 'http://www.w3.org/2000/svg';
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
        var line = $(document.createElementNS(svgns, 'line'));
        line.attr({x1: x[0], y1: y[0], x2: x[1], y2: y[1], stroke: 'green', 'stroke-width': '2'});
        line.appendTo($('#MapLayer'));
        $('.selected').each(function(i, e) {
          e.classList.remove('selected');
        });
      }
    });
  });
});