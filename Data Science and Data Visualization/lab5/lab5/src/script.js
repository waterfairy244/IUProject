var rowConverter = function (d) {
  return {
    "5/4/20": parseInt(d["5/4/20"]),
    Lat: parseFloat(d.Lat),
    Long: parseFloat(d.Long),
    "Province/State": d["Province/State"],
    "Country/Region": d["Country/Region"]
  };
};
d3.csv( "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv",
  rowConverter,
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      dataset = data;
      console.log(data);
      showScatterPlot(dataset);
    }
  }
);
var dataset;
function showScatterPlot(dataset) {
  var margin = { top: 70, right: 100, bottom: 60, left: 100 },
    h = 600 - margin.top - margin.bottom,
    w = 800 - margin.left - margin.right;
  var body = d3.select("body");
  var xScale = d3
    .scaleLinear()
    .domain([ d3.min(dataset, function(d) { return d.Long; }) - 30,
                            d3.max(dataset, function(d) { return d.Long; }) + 40 ])
    .range([0, w]);
  var yScale = d3
    .scaleLinear()
   .domain([ d3.min(dataset, function(d) { return d.Lat; }) - 20,
                            d3.max(dataset, function(d) { return d.Lat; }) + 20 ])
    .range([h, 0]);

  var sp = body
    .append("svg")
    .attr("height", h + margin.top + margin.bottom)
    .attr("width", w + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xAxis = d3.axisBottom().scale(xScale);
  var yAxis = d3.axisLeft().scale(yScale);
  
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
.style("background-color", "#E8DFB7")
    .style("border", "solid")
    .style("border-width", "3px")
    .style("border-radius", "8px")
    .style("padding", "10px");
  //set opacity
var colorScale = d3.scaleLinear()
    	.domain([0, 1200000])
    	.range([0, 20])

  var circles = sp
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.Long);
    })
    .attr("cy", function (d) {
      return yScale(d.Lat);
    })
   .attr("r", 8)
  .style("fill", "#C63EF5")
  .attr('fill-opacity', d => colorScale(d["5/4/20"]))
   .on("mouseover", function(d) {
          tooltip.transition()
               .duration(200)
               .style("opacity", 2);
          tooltip.html( d["Province/State"] + "<br/>" + d["Country/Region"] + "<br/> (" + d.Long 
	        + ", " + d.Lat + ")" + "<br/> Confirmed cases: " + d["5/4/20"])
               .style("left", (d3.event.pageX + 5) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(400)
               .style("opacity", 0);
      });

  sp.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", -10)
    .attr("x", w)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Longtitude");

  sp.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Latitude");
}

