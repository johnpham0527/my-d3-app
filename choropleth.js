"use strict";

/*** Initialize global variables */
/** Dataset */

/** Tooltip */

/** Global choropleth map variables */
/* Graph dimensions */

/* Topology units */

/* Get Functions */
const getColor = (num) => { //given a number, return a color based on the gradient scale
    return colorArray[num];
 }

const colorArray = ["lightgreen", "palegreen", "darkseagreen", "mediumseagreen", "seagreen", "forestgreen", "green", "darkgreen"];

/* SVG const */

/*** Choropleth code */

/** Fetch data */

    /** Local choropleth map variables */

    const legendCellHeight = 4;
    const legendCellWidth = 12;

    const legendTickArray = ["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"];

    const legendAxis = d3.axisBottom(legendScale)
            .tickValues(legendTickArray)
            .tickFormat(d3.format(".2f"));

    /** Map topology */

    /** Map dataset to graph */

    /** Data attributes */

    /** Tooltip */

    /** Legend axis*/

    /** Legend cells */


    //Closing brace

/*** To-do's */
/*
[ ] Study data
    [ ] Education data uses fips, which matches the id used in topology data


*/
