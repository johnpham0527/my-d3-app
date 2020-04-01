"use strict";

/*** Initialize global variables */
/** Dataset */


/** Data Request */



/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class", "tooltip")
                   .attr("id", "tooltip")
                   .style("opacity", 0);

/** Global choropleth map variables */
/* Graph dimensions */
const w = 1100;
const h = 700;
const padding = 80;

/* Get Functions */


/* SVG const */
const svg = d3.select("#treemap")
    .append("svg")
    .attr("width",w)
    .attr("height",h);

/*** Choropleth code */


    /** Fetch data */


    /** Process data */

        
        /* Legend variables */


        /* Output tiles */


            /** Tooltip */



        /* Output legend */

 

    /** Log errors */
    .catch((error) => {
        console.log(error);
    })