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

/** Global treemap map variables */
/* Graph dimensions */
const w = 1100;
const h = 700;
const padding = 80;

/* Helper Functions */
function wrap(text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

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

    /** Process data */
    let root = d3.hierarchy(videoGameData) //create data structure that represents a hierarchy
        .sum( d => d.value) //traverses the tree and sets .value on each node to the sum of its children
        .sort( (a,b) => b.value - a.value)

    /** Treemap hierarchy */
    let treemapLayout = d3.treemap(); //create the treemap

    treemapLayout.size([w, h]) //configure the width and height of the treemap
        .paddingOuter(1); //configure the outer padding
    
    treemapLayout(root); //call treemapLayout by passing in the root hierarchy object

    /** Color */
    const color = d3.scaleOrdinal()
        .domain(root.leaves().map( d => d.parent.data.name))
        //I need 17 colors here
        .range(["red", "orange", "yellow", "green", "blue", "violet"]);


    /** Tiles */
    svg.append("g") //join nodes to rect elements and update the x, y, width, and height properties of each rect
        .selectAll("rect") 
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("rect")
        .attr("class", "tile")
        //.attr("data-name", d => d.data.name)
        //.attr("data-category", d => d.parent.data.name)
        //.attr("data-value", d => d.data.value)
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "white")
        .style("fill", d => {
            if (d.parent.data.name === "Wii") {
                return "lightgreen";
            }
            else {
                return "lightblue";
            }
            
        })

    /** Text labels */
    svg.append("g")
        .selectAll("text")
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("text")
        .text( d => d.data.name)
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 + 20)
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
    document.getElementById("debug").innerHTML = videoGameData.children[0].children[0].name


       /* Legend variables */


        /* Output tiles */


            /** Tooltip */



        /* Output legend */



    } //closes out the last then statement
 ); //closes out the fetch statement


        
 /*** To-do */
 /*
[ ] Wrap labels
    [ ] Create my own wrap text helper function
    [ ] .append("text")
    [ ] attributes...
    [ ] .selectAll("tspan")
    [ ] .data ( create my own dataset here by calling the wrap text function)
    [ ] .enter
    [ ] .append("tspan")
    [ ] .html(d => d)
    [ ] attributes...
[ ] Create legend
[ ] Create an array of colors based on Color Brewer
[ ] Set style fill color based on parent name

 */
