"use strict";

/*** Initialize global variables */
/** Dataset */
let dataset = [];
let topology = [];

/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class", "tooltip")
                   .attr("id", "tooltip")
                   .style("opacity", 0);

/** Global choropleth map variables */
/* Graph dimensions */
const w = 1310;
const h = 420;
const padding = 80;

/* Topology units */



/* Get Functions */
const getColor = (num) => { //given a number, return a color based on the gradient scale
    return colorArray[num];
 }

const colorArray = ["lightgreen", "palegreen", "darkseagreen", "mediumseagreen", "seagreen", "forestgreen", "green", "darkgreen"];

/* SVG const */
const svg = d3.select("#choropleth")
    .append("svg")
    .attr("width",w)
    .attr("height",h)

/*** Choropleth code */

/** Fetch data */
fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
    .then(response => response.json())
    .then(data => dataset = data)
    .then(() => {

    /** Set up local choropleth map variables */

    const legendCellHeight = 4;
    const legendCellWidth = 12;

    const legendTickArray = ["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"];

    const legendAxis = d3.axisBottom(legendScale)
            .tickValues(legendTickArray)
            .tickFormat(d3.format(".2f"));

    /** Map topology */

    /** Map dataset to graph */

    /** Insert data attributes */

    /** Display tooltip */

    /** Display legend axis*/
    svg.append("g")
        .attr("transform", "translate(" + (w-padding-legendCellWidth*colorArray.length) + "," + (padding/12 + cellHeight - 1) + ")")
        .call(legendAxis);

    /** Display legend cells */
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

    }); //Closing brace for last 'then' statement and closing parenthesis for fetch statement

/*** To-do's */
/*
[ ] Study data
    [ ] Education data uses fips, which matches the id used in topology data


*/
