"use strict";

/*** Initialize global variables */
/** Dataset */
let dataset = [];
let topology = {};

/** Data Request */
let queue = d3.queue();
const EDUCATION_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";
const COUNTIES_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";


/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class", "tooltip")
                   .attr("id", "tooltip")
                   .style("opacity", 0);

/** Global choropleth map variables */
/* Graph dimensions */
const w = 1100;
const h = 650;
const padding = 80;

/* Topojson */
//const topology = topojson.topology({foo: geojson});


/* Get Functions */
const getColor = (num) => { //given a number, return a color based on the gradient scale
    return colorArray[num];
 }

const colorArray = ["lightgreen", "palegreen", "darkseagreen", "mediumseagreen", "seagreen", "forestgreen", "green", "darkgreen"];

/* SVG const */
const svg = d3.select("#choropleth")
    .append("svg")
    .attr("width",w)
    .attr("height",h);

/*** Choropleth code */

Promise.all([ //use Promise to fetch both education and topological data sets"

    /** Fetch data */
        fetch(EDUCATION_URL).then( response => response.json()),
        fetch(COUNTIES_URL).then( response => response.json())
        ])

    /** Process data */
    .then(([educationData, topologyData]) => {
        
        /* Debug Output */
        /*
        document.getElementById('debug1').innerHTML = educationData;
        document.getElementById('debug2').innerHTML = topologyData;
        */

        /* Data manipulation variables */
        const topojsonObject = topojson.feature(topologyData, topologyData.objects.counties);
        const counties = topojsonObject.features;

        /* Output counties */
        svg.selectAll("path")
            .data(counties)
            .enter()
            .append("path")
            .attr("d", d3.geoPath());



    })

    /** Log errors */
    .catch((error) => {
        console.log(error);
    })










/*
fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json') //fetch education data
    .then(response => response.json())
    .then(data => dataset = data) //store education data into dataset
    .then(fetch('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'))
    .then(response => response.json())
    .then(data => topology = data) // store topology data into dataset
    .then(() => {

        document.getElementById('debug1').innerHTML = dataset;
        document.getElementById('debug2').innerHTML = topology;

*/
        /** Set up local choropleth map variables */
        /*
        const legendCellHeight = 4;
        const legendCellWidth = 12;

        const legendTickArray = ["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"];

        const legendAxis = d3.axisBottom(legendScale)
                .tickValues(legendTickArray)
                .tickFormat(d3.format(".2f"));
        */

        /** Map topology */

        /** Map dataset to graph */

        /** Insert data attributes */

        /** Display tooltip */

        /** Display legend axis*/
        /*
        svg.append("g")
            .attr("transform", "translate(" + (w-padding-legendCellWidth*colorArray.length) + "," + (padding/12 + cellHeight - 1) + ")")
            .call(legendAxis);
        */

        /** Display legend cells */
        /*
        svg.append("g")
            .attr("id","legend")
            .selectAll("rect")
            .data(colorArray) //use the color array as the dataset
            .enter() 
            .append("rect")
            .attr("x", (d, i) => (w-padding-legendCellWidth*colorArray.length) + legendCellWidth*i) //place it in the top right location
            .attr("y", padding/12)
            .attr("width", legendCellWidth)
            .attr("height", legendCellHeight)
            .style("fill", (d) => d);
            */

            
//}); //Closing brace for last 'then' statement and closing parenthesis for fetch statement
            

/*** To-do's */
/*
[ ] Study data
    [ ] Education data uses fips, which matches the id used in topology data
[ ] Fetch data
    [ ] Instead of using nested fetch statements, learn how to use d3.queue, defer, and await
[ ] Link to example assignment: https://codepen.io/freeCodeCamp/full/EZKqza

*/
