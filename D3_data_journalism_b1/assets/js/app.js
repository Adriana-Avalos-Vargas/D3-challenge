// @TODO: YOUR CODE HERE!

//Stablish svg size
var svgWidth = 960;
var svgHeight = 500;

//Render margins
var margin ={
    top: 20,
    right: 40,
    bottom: 80,
    left:100
};

//Stablish graph size
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

//Create svg wrapper, append a SVG group the holds the chart
//and shift the latter by the left and top margins
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

console.log("create space for graph")

//Append an SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

//Initial params
var chosenXAxis = "poverty";

//function to update x-scale var upon click on axis label
function xScale(usData, chosenXAxis){
    //create scales
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(usData, d => d[chosenXAxis]) * 0.8,
      d3.max(usData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;
}


//function used for updating xAxis var upon click on axis level
function renderXAxis(newXscale, xAxis){
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}


//function used for updating circles group with a transition to
//new circles
function renderCircles(circlesGroup, newXscale, chosenXAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXscale(d[chosenXAxis]));

    return circlesGroup;
}

//function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, circlesGroup){

    var label;

    if(chosenXAxis === "poverty"){
        label = "In Poverty:";
    }
    else{
        label ="Age";
    }

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80,-60])
    .html(function(d){
        return(`${d.state}<hr>${d.smokes}%`);
    });
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data){
        toolTip.show(data);
    })

    //on mouse out event
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });
    return circlesGroup;
}

//Retrieve data from the csv file and execute all the functions bellow
d3.csv("data.csv").then(function(usData, err){
    if (err) throw err;

    //parse data
    usData.forEach(function(data){
        data.poverty = +data.poverty;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        console.log("transformed data in number")
    });

    //use xLinearScale function TO CREATE X scale
    var xLinearScale = xScale(usData, chosenXAxis);

    //use yLinearScale function to create y scales
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(usData, d=>d.healthcare)])
        .range([height,0]);

    console.log(xLinearScale);
    console.log(yLinearScale);

    //Create initial axis functins
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    console.log(bottomAxis);
    console.log(leftAxis);

    //Append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //Append y axis
    chartGroup.append("g")
        .call(leftAxis);

    //Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(usData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 15)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".5");

    //////////////////////////////////////////////////////
    //Create group for 2 x axis labels
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = xLabelsGroup.append("text")
        .attr("x",0)
        .attr("y", 20)
        .attr("value", "poverty") //value to grab for event listener
        .classed("active", true)
        .text("In Poverty (%)");
    
    var ageLabel = xLabelsGroup.append("text")
        .attr("x",0)
        .attr("y",40)
        .attr("value", "age") // value to grab for event listener
        .classed("inactive", true)
        .text("Age (Median)");

    //append y axis
    chartGroup.append("text")
    .attr("transform", "rotate( -90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 -( height/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)");

    //update tooltip function
    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    
    //x axis labels event listener
    xLabelsGroup.selectAll("text")
        .on("click", function(){
            //get value of the selection
            var xvalue = d3.select(this).attr("value");
            if(xvalue !== chosenXAxis){
                //REPLACES chosenXaxis with value
                chosenXAxis = xvalue;
            
                //update x axis with function above
                xLinearScale = xScale(usData, chosenXAxis);

                //update x axis with transition
                xAxis = renderXAxis(xLinearScale, xAxis);

                //update circles with new x values
                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

                //changes classes to change bold text
                if(chosenXAxis === "age"){
                    ageLabel
                    .classed("active", true)
                    .classed("inactive", false);
                    povertyLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
                else{
                    ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                    povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);

                }


            }
        });
        
    }).catch(function(error){
        console.log(error);
});

    




    
