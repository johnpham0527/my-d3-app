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

    let root = d3.hierarchy(videoGameData) //create data structure that represents a hierarchy
        .sum( d => d.value) //traverses the tree and sets .value on each node to the sum of its children
        .sort( (a,b) => b.value - a.value)

    let treemapLayout = d3.treemap(); //create the treemap

    treemapLayout.size([w, h]) //configure the width and height of the treemap
        .paddingOuter(2); //configure the outer padding
    
    treemapLayout(root); //call treemapLayout by passing in the root hierarchy object

    /** Tiles */
    svg.append("g") //join nodes to rect elements and update the x, y, width, and height properties of each rect
        .selectAll("rect") 
        .attr("class", "tile")
        .data(root.descendants()) //returns a flat array of root's descendants
        .enter()
        .append("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "black")
        .style("fill", "lightblue")

    /** Text labels */
    svg.append("g")
        .selectAll("text")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 +20)
        .text( d => d.data.name)
        .attr("font-size", "0.5em")
        .attr("fill", "black")

    
    /** Text labels */
/*
    svg.selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 +20)
        .text( d=> d.name)
        .attr("font-size", "1em")
        .attr("fill", "white")
*/

    /** Debug */
    document.getElementById("debug").innerHTML = videoGameData.children

    
    } //closes out the last then statement
 ); //closes out the fetch statement

    /** Process data */

        
        /* Legend variables */


        /* Output tiles */


            /** Tooltip */



        /* Output legend */

 

    /** Log errors */
