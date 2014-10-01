$(document).ready(function(){

  var width = 960,
      height = 600;

  var proj = d3.geo.orthographic()
    .scale(475)
    .translate([width/2, height/2])
    .clipAngle(90)
    .precision(0.1);

  var path = d3.geo.path()
    .projection(proj);

  var graticule = d3.geo.graticule();

  var svg = d3.select("div#map").append("svg")
    .attr("width", width)
    .attr('height', height)

  svg.append("path")
    .datum(graticule)
    .attr('class', 'graticule')
    .attr('d', path);

  d3.json('/world', function(errors, col) {
    svg.insert("path", ".graticule")
      .datum(topojson.feature(col, col.objects.land))
      .attr("class", "land")
      .attr("d", path)
  });

  var points = svg.append("g")
    .attr('class', 'points')

  var coords = [];

// openSocket(socket);

  setInterval(function() {
    var c = chance.coordinates();
    c = c.split(", ");
    var lat = parseFloat(c[0]);
    var lon = parseFloat(c[1]);
    coords.push([lat, lon]);
    updateMap();
  }, 1000);


  function updateMap() {
    points.selectAll('circle')
      .data(coords)
      .enter().append('circle')
      .attr('r', 2)
      .style('fill', 'red')
      .attr('cy', function(d){
        console.log(d);
        return proj(d)[1];
      })
      .attr('cx', function(d){
        return proj(d)[0];
      });
    }




  // var points = d3.select(".points")
  //   .selectAll('circle')
  //   .data(coords);
  //   debugger

  //   g.selectAll()

  // points.enter().append('circle')
  //   .attr('cy', function(d){
  //       return proj(d[0]);
  //   })
  //   .attr('cx', function(d){
  //       return proj(d[1]);
  //   })
  //   .attr('r', 4.5);
  // }
});