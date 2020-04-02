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
        .attr("class", "tile")
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("rect")
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
        
    svg.selectAll("text")
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("text") //append text for each child
        .selectAll("tspan") //for each child's text, select all tspans
        .data(d => {
            return d.data.name.split(" ") //split the string into an array at each space
            //need to write my own wrapText function that splits based on width
                .map(v => {
                    return { //an object that has a property called "text" with the split text, the x0 reference, and the y0 reference
                        text: v,
                        x0: d.x0, //keep the x0 reference
                        y0: d.y0 //keep the y0 reference
                    }
                });
        }) 
        .enter()
        .append("tspan") //add a <tspan> for every text line
        .attr("x", d => d.x0 + 5)
        .attr("y", (d, i) => d.y0 + 20 + i*12) //offset by index
        .text(d => d.text)
        .attr("font-size", "0.75em")
        .attr("fill", "black")

        

    /*
    svg.append("g")
        .selectAll("text")
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("text")
        .text( d => d.data.name)
        .attr("x", d => d.x0 + 5)
        .attr("y", d => d.y0 + 20)
        .attr("font-size", "0.75em")
        .attr("fill", "black")
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
    [ ] Create my own wrap text helper function that splits a text given the width
[ ] Create legend
[ ] Create an array of colors based on Color Brewer
[ ] Set style fill color based on parent name
[] Implement id's and classes

 */
