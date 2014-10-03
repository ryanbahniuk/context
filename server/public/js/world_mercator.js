$(document).ready(function(){

var width = 960,
    height = 500;

var proj = d3.geo.mercator()
    .center([0, 5 ])
    .scale(150)
    .rotate([-180,0]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geo.path()
    .projection(proj);

var g = svg.append("g");

// load and display the World
d3.json("world-2", function(error, topology) {
    g.selectAll("path")
      .data(topojson.object(topology, topology.objects.countries)
          .geometries)
    .enter()
      .append("path")
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

  // d3.timer(function(){
    
  // })




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