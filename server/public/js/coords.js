$(document).ready(function(){
// var socketAddress = 'ws://104.131.117.55:8080';
var socketAddress = "ws://localhost:8080/";

// var socket = new WebSocket(socketAddress);

var data = [];

// openSocket(socket);

setInterval(function(){
  var c = chance.coordinates();
  c = c.split(", ");
  var lat = parseFloat(c[0]);
  var lon = parseFloat(c[1]);
  data.push([lat, lon]);
  updateMap(data);
  
}, 50);

  // renderMap(data);
// });



// function renderMap(){
  var width = 1000;
  var height = 600;

  var proj = d3.geo.stereographic()
    .scale(100)
    .translate([width/2, height/2]);

  var path = d3.geo.path()
    .projection(proj);

  var graticule = d3.geo.graticule();

  var svg = d3.select("div#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  d3.json("/world", function(error, world){
    svg.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries,
        function(a, b) { return a !== b }))
      .attr("class", "boundary")
      .attr("d", path);
  });
// };

  function updateMap(){
    svg.selectAll(".point")
    .data(data)
    .enter().append("circle", ".point")
    .attr("r", 2)
    .style("fill", "red")
    .attr("transform", function(d){
      return "translate(" + proj([
        d[0], d[1] ]) + ")"
    });
  };
});


function openSocket(socket){
  socket.onopen = function() {
    var msg = {vis: true};
    socket.send(JSON.stringify(msg));
  };

  socket.onmessage = function(e) {
    var msg = JSON.parse(e.data);
    console.log(msg);
    var coords = msg["coords"];
    console.log(coords);
  }
}
