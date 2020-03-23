'use strict';

/*** Initialize global variables */

/** Dataset */
let dataset = [];

/** Tooltip */
const tooltip = d3.select("body")
                   .append("div")
                   .attr("class","tooltip")
                   .attr("id","tooltip")
                   .style("opacity",0)

/** Heatmap variables */ 
                
/*** Heatmap code */
/** Fetch data */
fetch('tps://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => dataset = data.slice())
    .then(() => {

    }