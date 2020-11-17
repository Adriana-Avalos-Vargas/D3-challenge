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
    var xLinearScale = d3.scaleLinear()
      .domain([7, d3.max(usData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(usData, d => d.healthcare)])
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

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(usData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", ".5");

    // Step 6: Create text
    // ==============================
    var textGroup = chartGroup.selectAll("text")
    .data(usData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px")
    .attr("fill", "red")
    .text(function(d) { return d.abbr; });

    

}).catch(function(error) {
  console.log("No lo lee")
  console.log(error);
});


