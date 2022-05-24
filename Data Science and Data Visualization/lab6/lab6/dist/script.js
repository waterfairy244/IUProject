var rowConverter = function (d) {
  return {
    Confirmed_cases: parseInt(d["Confirmed_cases"]),
    Date: d3.timeParse("%m/%d/%Y")(d.Date),
    Country: d.Country
  };
};
var margin = { top: 70, right: 150, bottom: 60, left: 100 },
  h = 600 - margin.top - margin.bottom,
  w = 800 - margin.left - margin.right;

d3.csv(
  "https://raw.githubusercontent.com/waterfairy244/data/main/data_lab6.csv",
  rowConverter,
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      var groupedData = d3
        .nest()
        .key(function (d) {
          return d.Country;
        })
        .entries(data);
      console.log(groupedData);

      var xScale = d3
        .scaleTime()
        .domain([
          d3.min(data, function (d) {
            return d.Date;
          }),
          d3.max(data, function (d) {
            return d.Date;
          })
        ])
        .range([0, w]);
      var yScale = d3
        .scaleLinear()
        .domain([
          d3.min(data, function (d) {
            return d["Confirmed_cases"];
          }) - 200000,
          d3.max(data, function (d) {
            return d["Confirmed_cases"];
          })
        ])
        .range([h, 0]);

      var sp = d3
        .select("body")
        .append("svg")
        .attr("height", h + margin.top + margin.bottom)
        .attr("width", w + margin.left + margin.right)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var parseDate = d3.timeFormat("%d/%m");
      var xAxis = d3.axisBottom().scale(xScale).tickFormat(parseDate);
      var yAxis = d3.axisLeft().scale(yScale);

      sp.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("y", -10)
        .attr("x", w + 30)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Date");

      sp.append("g")
        .attr("class", "axis")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", 10)
        .attr("y", 5)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Confirmed cases");

      //set color pallete for different vairables
      var group = groupedData.map(function (d) {
        return d.key;
      });
      var color = d3
        .scaleOrdinal()
        .domain(group)
        .range(["#ffff33", "#a65628", "#f781bf", "#999999"]);

      // Draw the line
      sp.selectAll(".line")
        .data(groupedData)
        .enter()
        .append("path")
        .attr("d", function (d) {
          return d3
            .line()
            .x(function (d) {
              return xScale(d.Date);
            })
            .y(function (d) {
              return yScale(d["Confirmed_cases"]);
            })(d.values);
        })
        .attr("fill", "none")
        .attr("stroke", function (d) {
          return color(d.key);
        })
        .attr("stroke-width", 2);
      //append legends
      var legend = sp
        .selectAll("g")
        .data(groupedData)
        .enter()
        .append("g")
        .attr("class", "legend");

      legend
        .append("circle")
        .attr("x", w + 100)
        .attr("y", function (d, i) {
          return i * 30 + 350;
        })
        .attr("r", 6)
        .style("fill", function (d) {
          return color(d.key);
        });
    }
  }
);