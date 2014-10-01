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
  updateMap();
  
}, 1);

  var width = 960;
  var height = 500;

  var proj = d3.geo.albersUsa()
    .scale(1000)
    .translate([width/2, height/2]);

  var path = d3.geo.path()
    .projection(proj);

  var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.json("/us", function(error, us){
    svg.insert("path", ".graticule")
      .datum(topojson.feature(us, us.objects.land))
      .attr("class", "land")
      .attr("d", path)

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b){
        return a !== b && !(a.id/1000 ^ b.id / 1000);
      }))
      .attr("class", "county-boundary")
      .attr("d", path);

    svg.insert("path", ".graticule")
      .datum(topojson.mesh(us, us.objects.states, function(a, b){
        return a !== b; 
      }))
      .attr("class", "state-boundary")
      .attr("d", path);
  });

  d3.select(self.frameElement).style("height", height + "px");

  function updateMap(){
    svg.selectAll(".point")
      .data(data)
      .enter().append("circle", ".point")
      .attr("r", 2)
      .style("fill", "white")
      .attr("transform", function(d){
        if (proj([d])) { console.log() }
        return "translate(" + proj([ d ]) + ")";
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
