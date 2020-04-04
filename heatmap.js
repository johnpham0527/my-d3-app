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
const padding = 80;

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
const colorArray = [ "#3288bd", "#66c2a5", "#abdda4", 
                     "#e6f598", "#ffffbf", "#fee08b", 
                     "#fdae61", "#f46d43", "#d53e4f"]; //use colors from ColorBrewer2.org

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
        for (let i = 0; i < 8; i++) { //populate the unitTicks array
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
            .style("fill", (d) => { //This algorithm matches the temp value to the current gradient value based on the unit tick intervals
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

        /** Tooltip */
            .on("mouseover", (d) => {
                tooltip.style("opacity", 0.8)
                .attr("id", "tooltip")
                .attr("data-year", d.year)
                .attr("data-variance", d.variance)
                .attr("data-temp", baseTemp + d.variance)
                .html( () => {
                    let outputTemp = Math.round((baseTemp + d.variance)*100)/100; //rounds up to 2 decimal places
                    let outputVariance = Math.round(d.variance*100)/100; //rounds up to 2 decimal places
                    let outputSign = outputVariance > 0 ? "+" : ""; //ternary operator: assign plus sign if outputVariance is positive
                    return d.year + " - " + month(d.month) + "<br>" + outputTemp + "&#8451<br>" + outputSign + outputVariance + "&#8451";
                })     
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY - 5 + "px")
            })
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

        /** Legend axis */
        svg.append("g")
            .attr("transform", "translate(" + (w-padding-legendCellWidth*colorArray.length) + "," + (padding/12 + cellHeight - 1) + ")")
            .call(legendAxis);

        /** Legend cells */
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
            .attr("border", 1)
            .style("stroke", "black")
            .style("fill", (d) => d)

}); // Closing brace for last then statement and closing parenthesis for fetch statement