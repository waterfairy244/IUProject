var rowConverter = function (d) {
  return {
    population: parseFloat(d.population),
    "GRDP-VND": parseFloat(d["GRDP-VND"]),
    area: parseFloat(d.area),
    density: parseInt(d.density)
  };
};
d3.csv(
  "https://tungth.github.io/data/vn-provinces-data.csv",
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
function showScatterPlot(data) {
  var margin = { top: 70, right: 100, bottom: 60, left: 100 },
    h = 430 - margin.top - margin.bottom,
    w = 800 - margin.left - margin.right;
  var body = d3.select("body");
  var xScale = d3
    .scaleLinear()
    .domain([
      d3.min([
        0,
        d3.min(dataset, function (d) {
          return d.population;
        })
      ]),
      d3.max([
        0,
        d3.max(dataset, function (d) {
          return d.population;
        })
      ])
    ])
    .range([0, w]);
  var yScale = d3
    .scaleLinear()
    .domain([
      d3.min([
        0,
        d3.min(dataset, function (d) {
          return d["GRDP-VND"];
        })
      ]),
      d3.max([
        0,
        d3.max(dataset, function (d) {
          return d["GRDP-VND"];
        })
      ])
    ])
    .range([h, 0]);

  var rScale = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(dataset, function (d) {
        return d.area;
      })
    ])
    .range([2, 9]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var sp = body
    .append("svg")
    .attr("height", h + margin.top + margin.bottom)
    .attr("width", w + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xAxis = d3.axisBottom().scale(xScale).ticks(10);
  var yAxis = d3.axisLeft().scale(yScale).ticks(10);

  var circles = sp
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return xScale(d.population);
    })
    .attr("cy", function (d) {
      return yScale(d["GRDP-VND"]);
    })
    .attr("r", function (d) {
      return rScale(d.area);
    })
    .attr("stroke-width", 1)
    .style("fill", function (d) {
      return color(d.density);
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
    .text("population");

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
    .text("GRDP-VN");
}