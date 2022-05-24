var rowConverter = function(d) {
  return {
    "GRDP-VND": parseFloat(d["GRDP-VND"]),
      "GRDP-USD": parseFloat(d["GRDP-USD"]),
    province: d.province
  };
};

d3.csv("https://tungth.github.io/data/vn-provinces-data.csv", rowConverter, function(error, data) {
    if (error) {
	  console.log(error);
    }
    else {
      var data20 = data.slice(0, 20);
      console.log(data20);
        var margin = {top: 20, right: 50, bottom: 30, left: 150},
    w = 800 - margin.left - margin.right,
    h = 1000 - margin.top - margin.bottom;
   
  var xScale = d3.scaleLinear()
  .domain([0, d3.max(data20, function(d) { return d["GRDP-VND"]; })])
          .rangeRound([0, w]);
  var yScale = d3.scaleBand()
  .domain(data20.map(function(d) { return d.province; }))
          .rangeRound([h, 0])
          .paddingInner(0.1);
  
    var svg = d3.select("body")
    .append("svg")
    .attr("height", h + margin.top + margin.bottom)
    .attr("width", w + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
 var xAxis = d3.axisBottom().scale(xScale).ticks(10);
  var yAxis = d3.axisLeft().scale(yScale).ticks(20);
  
  svg.selectAll("rect")
      .data(data20)
    .enter().append("rect")
      .attr("x", xScale(0))
      .attr("width", function(d) {return xScale(d["GRDP-VND"]); } )
      .attr("y", function(d) { return yScale(d.province); })
      .attr("height", yScale.bandwidth())
    .attr("fill", "#86B0ED");
  
 svg.selectAll("text")
			   .data(data20)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d["GRDP-VND"];
			   })
			   .attr("text-anchor", "middle")
			   .attr("y", function(d) {
			   		return yScale(d.province) + yScale.bandwidth() / 2 + 2;
			   })
			   .attr("x", function(d) {
			   		return xScale(d["GRDP-VND"]) + 10;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "14px")
			   .attr("fill", "#86476F");
  
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", -10)
    .attr("x", w)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
  
  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
  
  d3.select("p")
				.on("click", function() {
     var data43 = data.slice(21, 63);
    data20.push(data43);
    
    xScale.domain([0, d3.max(data20, function(d) { return d["GRDP-VND"]; })]);
     yScale.domain(data20.map(function(d) { return d.province; }));
    
    var bars = svg.selectAll("rect")
						.data(data20);	
    
    bars.enter()
    .append("rect")
.attr("y", h)		
						.attr("x", function(d) {	
							return w - xScale(d["GRDP-VND"]);
						})
						.attr("height", yScale.bandwidth())	
						.attr("width", function(d) {			
							return xScale(d["GRDP-VND"]);
						})
    .attr("fill", "pink")
    .merge(bars)
    .transition()	
    .duration(500)
         .attr("x", xScale(0))
      .attr("width", function(d) {return xScale(d["GRDP-VND"]) } )
      .attr("y", function(d) { return yScale(d.province); })
      .attr("height", yScale.bandwidth());
  });
    }}
           );