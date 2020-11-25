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

//Stablish grph size
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
var chosenYAxis = "healthcare"

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

//function to update x-scale var upon click on axis label
 function yScale(usData, chosenYAxis){
     //create scales
     var yLinearScale = d3.scaleLinear()
     .domain([0, d3.max(usData, d => d[chosenYAxis])])
     .range([height, 0]);

    return yLinearScale;
 }

//function used for updating xAxis var upon click on axis level
function renderXAxis(newXscale, xAxis){
    var bottomAxis = d3.axisBottom(newXscale);

    xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

    return xAxis;
}

//function used for updating yAxis var upon a click on axis level
function renderYAxis(newYscale, yAxis){
    var leftAxis = d3.axisLeft(newYscale);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);

    return yAxis;
}

//function used for updating circles group with a transition to
//new circles
function renderCircles(circlesGroup, newXscale, newYscale, chosenXAxis, chosenYAxis){
    circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXscale(d[chosenXAxis]))
    .attr("cy", d => newYscale(d[chosenYAxis]));

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
        return(`${d.state} <hr>Smoking ${d.smokes}(%)<br>Mean age: ${d.age} years<br>Mean income ${d.income}<br>Obesity ${d.obesity} (%)`);
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
    var yLinearScale = yScale(usData, chosenYAxis);

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
    var yAxis = chartGroup.append("g")
        .call(leftAxis);

    //Append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(usData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
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
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

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
        })

    //////////////////////////////////////////////////////
    //Create group for 2 Y axis labels
    var yLabelsGroup = chartGroup.append("g")
    .attr("transform", "rotate(-90)");

var healthLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 4))
    .attr("y", 0 - margin.left/2)
    .attr("value", "healthcare") //value to grab for event listener
    .classed("active", true)
    .text("Lacks healthcare (%)");

var smokeLabel = yLabelsGroup.append("text")
    .attr("x", 0 - (height / 2))
    .attr("y", 0 - margin.left/4)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Smokes (%)");

//x axis labels event listener
yLabelsGroup.selectAll("text")
    .on("click", function(){
        //get value of the selection
        var yvalue = d3.select(this).attr("value");
        if(yvalue !== chosenYAxis){
            //REPLACES chosenXaxis with value
            chosenYAxis = yvalue;
        
            //update x axis with function above
            yLinearScale = yScale(usData, chosenYAxis);

            //update x axis with transition
            yAxis = renderYAxis(yLinearScale, yAxis);

            //update circles with new x values
            circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);

            //changes classes to change bold text
            if(chosenYAxis === "smokes"){
                smokeLabel
                .classed("active", true)
                .classed("inactive", false);
                healthLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else{
                smokeLabel
                .classed("active", false)
                .classed("inactive", true);
                healthLabel
                .classed("active", true)
                .classed("inactive", false);

            }


        }
    })

    

});


    
