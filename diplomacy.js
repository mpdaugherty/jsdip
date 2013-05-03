$(function(){
  var svgns = 'http://www.w3.org/2000/svg';
  function drawLine(x1, y1, x2, y2) {
    var line = $(document.createElementNS(svgns, 'line'));
    line.attr({'x1': x1, 'y1': y1, 'x2': x2, 'y2': y2, 'stroke': 'green', 'stroke-width': '10', 'style': 'pointer-events:none;'});
    line.appendTo($('#MapLayer'));
  }
  $.getJSON('maps/default.json', function(json) {
    $.get('maps/default.svg', function(data) {
      var svg = $(data).find('svg');
      svg.appendTo($('#map'));
      var pathSelector = 'path.land:not(.unplayable),path.water:not(.unplayable)';
      svg.find('.province').click(function(e) {
        var prov = $(this);
        var p = json.graph[prov.attr('id')];
        var unitLoc = {};
        var coastLocs = {};
        var localUnits = prov.find('.unit:not(.dislodged)').each(function(idx, elem) {
          if ($(elem).parent('.coast').length) {
            coastLocs[$(elem).parent('.coast').attr('data-coast')] = {
              x: $(elem).attr('x'),
              y: $(elem).attr('y')
            };
          } else {
            unitLoc.x = $(elem).attr('x');
            unitLoc.y = $(elem).attr('y');
          }
        });
        if (p.army) {
          for (var i = 0, leni = p.army.length; i < leni; i++) {
            var dest = $('#' + p.army[i] + ' .unit:not(.dislodged)').filter(function(idx) {
              return !$(this).parent('.coast').length;
            });
            drawLine(unitLoc.x, unitLoc.y, dest.attr('x'), dest.attr('y'));
          }
        }
        if (p.fleet) {
          if (p.fleet instanceof Array) {
            for (i = 0, leni = p.fleet.length; i < leni; i++) {
              if (p.fleet[i] instanceof Array) {
                // from non-coast to coast
                dest = $('#' + p.fleet[i][0] + ' g[data-coast="' + p.fleet[i][1] + '"] .unit:not(.dislodged)');
                drawLine(unitLoc.x, unitLoc.y, dest.attr('x'), dest.attr('y'));
              } else {
                // from non-coast to non-coast
                dest = $('#' + p.fleet[i] + ' .unit:not(.dislodged)');
                drawLine(unitLoc.x, unitLoc.y, dest.attr('x'), dest.attr('y'));
              }
            }
          } else {
            // from coast to ???
            for (var co in p.fleet) {
              for (i = 0, leni = p.fleet[co].length; i < leni; i++) {
                if (p.fleet[co][i] instanceof Array) {
                  // from coast to coast
                  // there are none of these, but it probably works
                  dest = $('#' + p.fleet[co][i][0] + ' g[data-coast="' + p.fleet[co][i][1] + '"] .unit:not(.dislodged)');
                  drawLine(coastsLocs[co].x, coastLocs[co].y, dest.attr('x'), dest.attr('y'));
                } else {
                  // from coast to non-coast
                  dest = $('#' + p.fleet[co][i] + ' .unit:not(.dislodged)');
                  drawLine(coastLocs[co].x, coastLocs[co].y, dest.attr('x'), dest.attr('y'));
                }
              }
            }
          }
        }
      });
    });
  });
});