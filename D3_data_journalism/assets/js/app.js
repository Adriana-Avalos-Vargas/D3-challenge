// @TODO: YOUR CODE HERE!

//Let's define the size of the svg
var svgWidth = 960;
var svgHeight = 500;

//Let's define the margin
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};


//Let´s define the actual size of the figure
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  console.log("veamos si imprime");
  // Import Data
  // Import Data
  d3.csv("data.csv").then(function(usData) {
    console.log("si leyo");
    console.log(usData);
  
    // Step 1: Parse Data/Cast as numbers
      // ==============================
      usData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        console.log("change to a number");
      });
  
      // Step 2: Create scale functions
      // ==============================
      var minimum = d3.min(usData, d => d.poverty);
      var maximum = d3.max(usData, d =>d.poverty);
      console.log(minimum);
      console.log(maximum);
      var xLinearScale = d3.scaleLinear()
        .domain([4, maximum*1.2])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(usData, d => d.healthcare)+5])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
      console.log(bottomAxis);
      console.log(leftAxis);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);

      var tooltip = d3.select("#scatter")
         .append("div")
         .style("opacity", 0)
         .attr("class", "tooltip")
         .style("background-color", "white")
         .style("border", "solid")
         .style("border-width", "1px")
         .style("border-radius", "5px")
         .style("padding", "10px")
      
      // A function that change this tooltip when the user hover a point.
      // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
      var mouseover = function(d) {
        tooltip
          .style("opacity", 1)
        }

      var mousemove = function(d) {
      tooltip
        .html(`${d.state} <hr>Smoking ${d.smokes}(%)<br>Mean age: ${d.age} years<br>Mean income ${d.income}<br>Obesity ${d.obesity} (%)`)
        .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (d3.mouse(this)[1]) + "px")
       }

      // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
      var mouseleave = function(d) {
        tooltip
          .transition()
          .duration(200)
          .style("opacity", 0)
      }

      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(usData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)
        .style("stroke", "white")
        .on("mouseover", mouseover )
        .on("mousemove", mousemove )
        .on("mouseleave", mouseleave );

      
        // ==============================
        svg.append('g')
        .selectAll("dot")
        .data(usData)
        .enter()
        .append("text")
        .attr("x", d => xLinearScale(d.poverty))
        .attr("y", d => yLinearScale(d.healthcare))
        .text(function (d) { return d.abbr})
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "blue")
        .attr("text-anchor", "middle");


      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks healthcare (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");

      
  
      
  }).catch(function(error) {
    console.log("No lo lee")
    console.log(error);
  });
  
  
  