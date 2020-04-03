"use strict";

/*** Initialize global variables */
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
const wrapText = (text, width, height) => {
    let maxWordWidth = Math.floor(width/7); //I estimate that each characters requires 7 pixels of width
    let maxTextLines = Math.floor(height/16); //I estimate that each text line requires 16 pixels of text

    let textArray = text.split(" "); //splice the text by space into an array of text lines

    for (let i = 0; i < textArray.length; i++) { //trim any text lines that exceed the maximum width
        let textLine = textArray[i];
        let slicedWord = textLine.slice(0,maxWordWidth);
        textArray[i] = slicedWord;
    }

    if (textArray.length > maxTextLines) {
        textArray = textArray.slice(0, maxTextLines); //trim any lines past the maximum number of text lines possible
    }

    return textArray;
  }

/* SVG Treemap const */
const svg = d3.select("#treemap")
    .append("svg")
    .attr("width",w)
    .attr("height",h);

const legendSVG = d3.select("#legend")
    .append("svg")
    .attr("width", w)
    .attr("height", h/3);

/*** Treemap code */

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
    let colorArray = ["red", "orange", "yellow", "green", "blue", "violet",
    "#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c",
    "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"];
    
    let categoryColors = {}; //this object will eventually store all of the unique category names as keys and a color value
    let categoryNamesArray = root.leaves().map(d => d.parent.data.name); //this array collects each leaf's category name

    for (let i = 0; i < categoryNamesArray.length; i++) { //populate categoryNames object with category keys
        categoryColors[categoryNamesArray[i]] = "";
    }

    Object.keys(categoryColors).forEach( (category, index) => { //populate each categoryColors with a color from colorArray
        categoryColors[category] = colorArray[index];
    })


    /** Tiles */
    svg.append("g") //join treemap nodes to rect elements and update the x, y, width, height, style and other properties of each rect
        .selectAll("rect") 
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("rect")
        .attr("class", "tile")
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.parent.data.name)
        .attr("data-value", d => d.data.value)
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .style("stroke", "white")
        .style("fill", d => categoryColors[d.parent.data.name])
    
        /**  Tooltip */
        .on("mouseover", (d) => {
            tooltip.style("opacity", 0.8)
            .attr("id", "tooltip")
            .attr("data-value", d.data.value)
            .html( 
                "Name: " + d.data.name + "<br>" + 
                "Category: " + d.parent.data.name + "<br>" +
                "Value: " + d.data.value  
            )     
            .style("left", d3.event.pageX + 5 + "px")
            .style("top", d3.event.pageY - 5 + "px")
        })
        .on("mouseout", (d) => {
            tooltip.style("opacity", 0)
        });

    /** Text labels */
    svg.append("g")
        .selectAll("text")
        .data(root.leaves()) //returns a flat array of nodes with no children
        .enter()
        .append("text")
        .selectAll("tspan")
        .data(d => {
            let width = d.x1 - d.x0;
            let height = d.y1 - d.y0;
            return wrapText(d.data.name, width, height) //call my custom wrapText function to split the text
                .map(textLine => { //wrapText returns an array of wrapped text lines. Map each array element to a tspan
                    return { //an object that has a property called "text" with the split text, the x0 reference, and the y0 reference
                        text: textLine,
                        x0: d.x0, //keep the same reference point
                        y0: d.y0 //keep the same reference point
                    }
                })
        })
        .enter()
        .append("tspan") //add a tspan for every text line  
        .attr("x", d => d.x0 + 5)
        .attr("y", (d, i) => d.y0 + 20 + i*12) //offset by index
        .text(d => d.text)
        .attr("font-size", "0.75em")
        .attr("fill", "black")


    /** Output legend */
    const legendCellWidth = 10;
    const legendCellHeight = 10;

    /*
    legendSVG.append("g") //generate legend cells separately in order to pass FreeCodeCamp validation
        .selectAll("rect")
        .data(Object.keys(categoryColors)) //use categoryColors keys as the dataset
        .enter()
        .append("rect") 
        .attr("x", (d, i) => (padding*10) + legendCellWidth*i + 15) //place it in the top right location
        .attr("y", padding/2 - legendCellHeight) //line it up to above the axis
        .attr("width", legendCellWidth)
        .attr("height", legendCellHeight)
        .style("fill", (d) => categoryColors[d]);
    */

    legendSVG.selectAll("g") //generate legend group
        .data(Object.keys(categoryColors)) //use categoryColors keys as the dataset
        .enter()
        .append("text") //generate legend text
        .attr("x", (d, i) => {  //two-column format
            if (i < 8) {
                return padding*2 + legendCellWidth + 4 //place it a bit to the right of the legend color cell
            }
            else {
                return padding*3 + legendCellWidth + 4 //place it in a second column, a bit to the right of the legend color cell
            }
        }) 
        .attr("y", (d, i) => padding/3 + legendCellHeight*i + 1) //line it up below each legend cell
        .attr("font-size", "0.75em")
        .text( d => d);

    } //closes out the last then statement
 ); //closes out the fetch statement 