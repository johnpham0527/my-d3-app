'use strict';

/*** Initialize global variables */
/** Dataset */
let dataset = {};

/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class","tooltip")
                   .attr("id","tooltip")
                   .style("opacity",0);

/** Global heat map variables */ 
/* Graph dimensions */
const w = 800;
const h = 600;
const padding = 60;

/* Time units */
let parseDate = d3.timeParse('%Y');
let formatYear = d3.timeFormat('%Y');
let parseMonth = d3.timeParse('%B');
let formatMonth = d3.timeFormat('%B');

const month = (m) => { //this custom month function returns the full month name
    switch (m) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default:
            break;
    }
}

/* SVG const */
const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width",w)
    .attr("height",h);

/*** Heatmap code */

/** Fetch data */
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => dataset = data)
    .then(() => {
        
        /** Local dataset variables */
        let baseTemp = dataset.baseTemperature;
        let monthlyData = dataset.monthlyVariance;

        /** Output base temperature into description*/
        document.getElementById("basetemp").innerHTML = baseTemp;

        // Debug statement
        //document.getElementById("debug").innerHTML = monthlyData[1].month;

        /** Local heat map variables */
        const xScale = d3.scaleLinear()
            .domain([d3.min(monthlyData, (d) => d.year-1), d3.max(monthlyData, (d) => d.year+1)])
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([12.5, 0.5]) //use 0.5 as min and 12.5 as max to offset the y-Axis
            .range([h - padding, padding]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(20)
            .tickSizeOuter(0) //do not show the outer tick
            .tickFormat(d3.format("d"));

        // Need to map my own time format function
       const yAxis = d3.axisLeft(yScale)
            .tickSizeOuter(0) //do not show the outer tick
            .tickFormat((d) => month(d)); //run the custom month function to output full month name

        /** Map dataset to graph */
        svg.selectAll("rect")
            .data(monthlyData)
            .enter()
            .append("rect")

            .attr("class", "cell")
            .attr("data-xvalue", (d) => d.year)
            .attr("data-yvalue", (d) => d.month)
            .attr("x", (d) => xScale(d.year)) //scale the location of the x value (year) using xScale
            .attr("y", (d) => yScale(d.month)) //scale the location y value (month) using yScale
            .attr("width", (d) => w / monthlyVariance.length) //set the width of each cell equal to the overall width dividing by the number of data elements
            .attr("height", (d) => h - yScale(d.month))
            .attr("fill", "darkslateblue") //I will need to figure out how to fill based on a gradient
 

        /** Data attributes */
            .attr("data-year", (d) => d.year)
            .attr("data-month", (d) => month(d.month))
            .attr("data-variance", (d) => d.variance)
            .attr("data-temp", (d) => baseTemp + d.variance)

        /** Tool tip */
        /* Mouseover */
        .on("mouseover", (d) => {
            tooltip.style("opacity, 0.8")
                .attr("id", "tooltip")
                .html(d.year + " - " + month(d.month))
                .style("left", d3.event.pageX + 5 + "px") //x-axis offset
                .style("top", d3.event.pageY - 5 + "px") //y-axis offset
        })

        /* Mouse out */
        .on("mouseout", (d) => {
            tooltip.style("opacity", 0)
        });

        /** Set up x-axis*/
        svg.append("g")
            .attr("id","x-axis")
            .attr("transform", "translate(0," + (h-padding) + ")")
            .call(xAxis);

        /** Set up y-axis */
        svg.append("g")
        .attr("id","y-axis")
        .attr("transform", "translate(" + padding + ",0)")
        .call(yAxis);
        

}); // Closing brace for last then statement and closing parenthesis for fetch statement


/*** Legend code */
/** Legend gradient */

/** Textual description */


/*** To-do's */
/*
[X] Study the data: 
    [X] Link: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
    [X] What is this heat map about? Climate change trends by month and by year
    [X] Determine the min and max values
    [X] Determine how to set up the x-axis: years
    [X] Determine how to set up the y-axis: month
[ ] Create heat map separately from legend
    [X] Create separate sections for legend and heatmap
[ ] Create heat map
    [ ] The x-axis should have tick labels with the years between 1754 and 2015
    [ ] The y-axis should have tick labels with the full name of the months of the year
    [ ] Figure out the length and width of each cell
[ ] Create the tool tips
[ ] Create legend
    [ ] The legend should have at least 4 different fill colors
*/
