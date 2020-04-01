"use strict";

/*** Initialize global variables */
/** Dataset */


/** Data Request */
const VIDEO_GAME_SALES_URL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json";


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
fetch(VIDEO_GAME_SALES_URL)
    .then( response => response.json())
    .then( videoGameData => { 



    /** Debug */
    document.getElementById("debug").innerHTML = videoGameData.name

    
    } //closes out the last then statement
 ); //closes out the fetch statement

    /** Process data */

        
        /* Legend variables */


        /* Output tiles */


            /** Tooltip */



        /* Output legend */

 

    /** Log errors */
