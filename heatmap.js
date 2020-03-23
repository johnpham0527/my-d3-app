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
fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => dataset = data.slice())
    .then(() => {
        
    /**  */



}); // Closing brace for last then statement and closing parenthesis for fetch statement

/*** Legend code */


/*** To-do's */
/*
[ ] Study the data: 
    [ ] Link: https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
    [ ] What is this heat map about? Climate change trends by month and by year
    [ ] Determine the min and max values
    [ ] Determine how to set up the x-axis: years
    [ ] Determine how to set up the y-axis: month
[ ] Create heat map separately from legend
    [X] Create separate sections for legend and heatmap
[ ] Create heat map
    [ ] The x-axis should have tick labels with the years between 1754 and 2015
    [ ] The y-axis should have tick labels with the full name of the months of the year
    [ ] Figure out the length and width of each cell
[ ] Create legend
    [ ] The legend should have at least 4 different fill colors
*/
