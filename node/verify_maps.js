var assert = require('assert'),
    m = require('../maps/default.json'),
    powers = m.powers,
    graph = m.graph,
    centers = m.centers,
    aliases = m.aliases;

(function(){
assert.equal(powers.length, 7, 'power count should be 7.');

for (var i = 0, leni = powers.length; i < leni; i++) {
  var power = powers[i];
  var units = {F:0, A:0};
  for (var j = 0, lenj = power.start.length; j < lenj; j++) {
    var start = power.start[j];
    var province = start.province;
    units[start.type]++;
    if (province instanceof Array) {
      var coast = province[1];
      province = province[0];
      assert.equal(start.type, 'F', 'only fleets can be on coasts.');
    }
    assert(graph[province], '"' + province + '" is not a valid province.');
    if (start.type === 'F') {
      assert(graph[province].fleet, 'A fleet cannot be on "' + province + '"');
      if (coast) {
        assert(graph[province].fleet[coast], 'Coast "' + coast + '" does not exist on "' + province + '"');
      }
    } else if (start.type === 'A') {
      assert(graph[province].army, 'An army cannot be on "' + province + '"');
    } else {
      assert.fail('', '', 'Expected F or A, got "' + start.type + '"');
    }
    coast = undefined;
  }
  if (powers[i].name === 'England') {
    assert.equal(units.F, 2, '2 fleets - england.');
    assert.equal(units.A, 1, '1 army - england.');
  } else if (powers[i].name === 'Russia') {
    assert.equal(units.F, 2, '2 fleets - russia.');
    assert.equal(units.A, 2, '2 armies - russia.');
  } else {
    assert.equal(units.F, 1, '1 fleet - ' + powers[i].name + '.');
    assert.equal(units.A, 2, '2 armies - ' + powers[i].name + '.');
  }
}

for (i = 0, leni = centers.length; i < leni; i++) {
  assert(graph[centers[i]], '"' + centers[i] + '" is not a valid province.');
}

var usedNames = {};
for (var p in graph) {
  if (usedNames[p]) {
    assert.fail('', '', '"' + p + '" defined twice.');
  }
  usedNames[p] = true;
}
for (p in aliases) {
  if (usedNames[p]) {
    assert.fail('', '', '"' + p + '" alias defined twice.');
  }
  assert(graph[aliases[p]], '"' + aliases[p] + '" does not exist.');
}

var units = ['fleet', 'army'];

for (p in graph) {
  var prov = graph[p];
  for (u in units) {
    var unit = units[u];
    if (prov[unit]) {
      if (prov[unit] instanceof Array) {
        var provArr = prov[unit];
        buttz(provArr, unit, p);
      } else {
        for (var co in prov[unit]) {
          buttz(prov[unit][co], unit, [p, co]);
        }
      }
    }
  }
}
}());
function buttz(provArr, unit, p) {
  for (var i = 0, leni = provArr.length; i < leni; i++) {
    var dest = provArr[i];
    if (dest instanceof Array) {
      assert.equal(unit, 'fleet', 'only fleets can coast.');
      var unitArr = graph[dest[0]][unit][dest[1]];
    } else {
      unitArr = graph[dest][unit];
    }
    assert(unitArr, 'error with "' + p + '" -> "' + provArr[i] + '".');
    if (p instanceof Array) {
      var pass = false;
      for (var j = 0, lenj = unitArr.length; j < lenj; j++) {
        if (JSON.stringify(unitArr[j])===JSON.stringify(p)) {
          pass = true;
          break;
        }
      }
      assert(pass, '"' + provArr[i] + '" -> "' + p + '" does not exist!');
    } else {
      assert(unitArr.indexOf(p) !== -1, '"' + provArr[i] + '" -> "' + p + '" does not exist.');
    }
  }
}
