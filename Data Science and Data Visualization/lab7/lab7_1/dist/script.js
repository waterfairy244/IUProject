var w = 600;
var h = 900;

//Create SVG element
var svg = d3.select("body").append("svg").attr("width", w).attr("height", h);

var color = d3
  .scaleQuantize()
  .range([
    "#d48b8f",
    "#c4717b",
    "#844454",
    "#95556e",
    "#4c4a6c",
    "#843c5e",
    "#643d57",
    "#352b44"
  ]);

d3.csv(
  "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces-data.csv",
  function (data) {
    console.log(data);
    //Set input domain for color scale
    color.domain([0, 9000]);

    d3.json(
      "https://raw.githubusercontent.com/TungTh/tungth.github.io/master/data/vn-provinces.json",
      function (json) {
        console.log(json);
        //Loop through once for each ag. data value
        for (var i = 0; i < data.length; i++) {
          //Grab province name
          var dataProvince = data[i].ma;
          //Grab data value, and convert from string to float
          var dataValue = parseFloat(data[i].population);
          //Find the corresponding state inside the GeoJSON
          for (var j = 0; j < json.features.length; j++) {
            var jsonProvince = json.features[j].properties.Ma;
            if (parseFloat(dataProvince) == parseFloat(jsonProvince)) {
              //Copy the data value into the JSON
              json.features[j].properties.population = dataValue;

              //Stop looking through the JSON
              break;
            }
          }
        }
var vis = d3.select("#vis").append("svg")
      .attr("width", w).attr("height", h)

 
      // create a first guess for the projection
      var center = d3.geoCentroid(json)
      var scale  = 150;
      var offset = [w/2, h/2];
      var projection = d3.geoAlbers().scale(scale).center(center)
          .translate(offset);

      // create the path
      var path = d3.geoPath().projection(projection);

      // using the path determine the bounds of the current map and use 
      // these to determine better values for the scale and translation
      var bounds  = path.bounds(json);
      var hscale  = scale*w  / (bounds[1][0] - bounds[0][0]);
      var vscale  = scale*h / (bounds[1][1] - bounds[0][1]);
      var scale   = (hscale < vscale) ? hscale : vscale;
      var offset  = [w - (bounds[0][0] + bounds[1][0])/2,
                        h - (bounds[0][1] + bounds[1][1])/2];

      // new projection
      projection = d3.geoAlbers().center(center)
        .scale(scale).translate(offset);
      path = path.projection(projection);

      // add a rectangle to see the bound of the svg
      vis.append("rect").attr('width', w).attr('height', h)
        .style('stroke', 'black').style('fill', 'none');

      vis.selectAll("path").data(json.features).enter().append("path")
        .attr("d", path)
        .style("fill", "red")
        .style("stroke-width", "1")
        .style("stroke", "black")
        //Define map projection
        var projection = d3
          .geoAlbers()
          .center(d3.geoCentroid(json))
          .rotate([2, 32])
          .parallels([11, 20])
          .scale([1000])
          .translate([w / 2, h / 2])
          .fitSize([w, h], json);

        //Define path generator
        var path = d3.geoPath().projection(projection);

        //Bind data and create one path per GeoJSON feature
        svg
          .selectAll("path")
          .data(json.features)
          .enter()
          .append("path")
          .attr("d", path)
          .style("fill", function (d) {
            //Get data value
            var value = d.properties.population;

            if (value) {
              //If value exists…
              return color(value);
            } else {
              //If value is undefined…
              return "#ccc";
            }
          });
      }
    );
  }
);