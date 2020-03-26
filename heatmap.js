'use strict';

/*** Initialize global variables */
/** Dataset */
let dataset = {};

/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class", "tooltip")
                   .attr("id", "tooltip")
                   .style("opacity", 0);

/** Global heat map variables */ 
/* Graph dimensions */
const w = 1310;
const h = 420;
const padding = 72;

/* Time units */
let parseDate = d3.timeParse('%Y');
let formatYear = d3.timeFormat('%Y');
let parseMonth = d3.timeParse('%B');
let formatMonth = d3.timeFormat('%B');

/* Get Functions */
const month = (m) => { //this custom month function returns the full month name
    return monthArray[m-1]
}

const colorScale = (num) => { //given a number, return a color based on the gradient scale
   return colorArray[num];
}

const monthArray = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const colorArray = ["midnightblue", "mediumblue", "royalblue", "lightcyan", "lightyellow", "peachpuff", "salmon", "crimson", "darkred"];

/* SVG const */
const svg = d3.select("#heatmap")
    .append("svg")
    .attr("width",w)
    .attr("height",h)

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

        /** Math and variables to figure out unit lengths and unit ticks */
        let allTemps = [];
        for (let i = 0; i < monthlyData.length; i++) {
            allTemps.push(monthlyData[i].variance + baseTemp);
        }
        let minTemp = Math.min(...allTemps); //find the minimum temperature within the data range
        let maxTemp = Math.max(...allTemps); //find the minimum temperature within the data range
        let unitLength = (maxTemp - minTemp) / 8; //identify the length of each unit tick
        let unitTicks = []; //this array will be used for the gradient
        for (let i = 0; i < 8; i++) { //populate the uniTicks array
            let num = minTemp + i*unitLength;
            unitTicks.push(Math.round(num * 100) /100);
        }

        /** Local heat map variables */
        const minYear = d3.min(monthlyData, (d) => d.year);
        const maxYear = d3.max(monthlyData, (d) => d.year);
        
        const cellHeight = (h - padding*2) / 12;
        const cellWidth = (w - padding*2) / (maxYear - minYear);
        const legendCellWidth = (w/3) / (maxTemp - minTemp);

        const legendTickArray = [0.15, 1.68, 3.21, 4.74, 6.26, 7.79, 9.31, 10.84, 12.36, 13.88];

        const xScale = d3.scaleLinear()
            .domain([minYear, maxYear])
            .range([padding, w - padding]);

        const yScale = d3.scaleLinear()
            .domain([12.5, 0.5]) //use 0.5 as min and 12.5 as max to offset the y-Axis
            .range([h - padding, padding]);

        const legendScale = d3.scaleLinear()
            .domain(legendTickArray)
            .range([0,legendCellWidth]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(20)
            .tickSizeOuter(0) //do not show the outer tick
            .tickFormat(d3.format("d"));

        const yAxis = d3.axisLeft(yScale)
            .tickSizeOuter(0) //do not show the outer tick
            .tickFormat((d) => month(d)); //run the custom month function to output full month name
        
        const legendAxis = d3.axisBottom(legendScale)
            .tickValues(legendTickArray)
            .tickFormat(d3.format(".2f"));
        

        /** Map dataset to graph */
        svg.selectAll("rect")
            .data(monthlyData)
            .enter() 
            .append("rect")
            .attr("class", "cell")
            .attr("x", (d) => xScale(d.year)) //scale the location of the x value (year) using xScale
            .attr("y", (d) => yScale(d.month - 0.5)) //scale the location y value (month) using yScale
            .attr("width", cellWidth)
            .attr("height", cellHeight)
            /* Gradient fill */
            .style("fill", (d) => {
                let color = "darkred"; 
                for (let i = 0; i < unitTicks.length; i++) {
                    let currentTick = unitTicks[i];
                    let thisTemp = baseTemp + d.variance;
                    if (currentTick < thisTemp) {
                        continue;
                    }
                    else {
                        color = colorScale(i);
                        break;
                    }
                }
                return color;
            })

        /** Data attributes */
            .attr("data-year", (d) => d.year)
            .attr("data-month", (d) => d.month-1)
            .attr("data-variance", (d) => d.variance)
            .attr("data-temp", (d) => baseTemp + d.variance)

        /** Tool tip */
        /* Mouseover */
            .on("mouseover", (d) => {
                tooltip.transition().duration(200)
                    .attr("id", "tooltip")
                    .attr("data-year", d.year)
                    .html(d.year + " - " + d.month)
                    .style("left", d3.event.pageX + 5 + "px") //x-axis offset
                    .style("top", d3.event.pageY - 5 + "px") //y-axis offset
            })

        /* Mouse out */
            .on("mouseout", (d) => {
                tooltip.transition().duration(200)
                .style("opacity", 0)
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

        /** Legend Axis */
        svg.append("g")
            .attr("transform", "translate(" + (w-padding-legendCellWidth*colorArray.length) + "," + (padding/12 + cellHeight) + ")")
            .call(legendAxis);

        /** Legend Cells */
        svg.append("g")
            .attr("id","legend")
            .selectAll("rect")
            .data(colorArray) //use the color array as the dataset
            .enter() 
            .append("rect")
            .attr("x", (d, i) => (w-padding-legendCellWidth*colorArray.length) + legendCellWidth*i) //place it in the top right location
            .attr("y", padding/12)
            .attr("width", legendCellWidth)
            .attr("height", cellHeight)
            .style("fill", (d) => d)

}); // Closing brace for last then statement and closing parenthesis for fetch statement


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
    [X] The x-axis should have tick labels with the years between 1754 and 2015
    [X] The y-axis should have tick labels with the full name of the months of the year
    [X] Figure out the length and width of each cell
    [X] Determine at least four gradient colors
        Midnight blue -> medium blue -> royal blue - > light cyan -> light yellow -> peach puff -> 
        salmon <- crimson <- Dark red
    [ ] Debug: the height for December cells isn't quite right
    [ ] Debug: the cells are shooting past the x-axis
    [X] Debug: there is white space between each cell width
    [X] A few of the colors are not on the color scale; decided to set default color to crimsonred
    [ ] For svg.selectAll, implement style fill use (d,i) => ... instead of using a for loop, which is slow
[ ] Create the tool tips
    [ ] Debug why tooltip doesn't appear
[ ] Create legend
    [ ] Create a legend axis
    [ ] Create grid boxes
    [ ] Leverage unitTicks array to generate tick labels
    [ ] Leverage unitTicks array and fill to generate gradient color boxes
[ ] Delete commented out or unneeded code
*/
