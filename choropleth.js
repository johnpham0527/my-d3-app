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
const h = 700;
const padding = 80;

/* Get Functions */
const getColor = (num) => { //given a number, return a color based on the gradient scale
    return colorArray[num];
 }

const colorArray = ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824"] //colors selected with help from https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=8
const degreeUnitTicks = [3, 12, 21, 30, 39, 48, 57, 66];


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
        //document.getElementById('debug1').innerHTML = educationData[0].bachelorsOrHigher;
        //document.getElementById('debug1').innerHTML = getProperty(educationData, 56045, "bachelorsOrHigher");
        //document.getElementById('debug2').innerHTML = topologyData.objects.counties.geometries[0].id;
        

        /* Data manipulation variables */
        const topojsonObject = topojson.feature(topologyData, topologyData.objects.counties);
        const counties = topojsonObject.features;

        let fipsHash = {}; //this is the hash of all counties
        educationData.forEach( (county) => { //map education data into fipsHash
            fipsHash[county.fips] = [county.area_name, county.state, county.bachelorsOrHigher];
        });
        

        /* Legend variables */
        const legendCellHeight = 12;
        const legendCellWidth = padding*3/8;

        const legendScale = d3
            .scaleBand()
            .domain(degreeUnitTicks)
            .range([0, padding*3])

        let legendAxis = d3.axisBottom(legendScale)  
            .tickSizeOuter(0)
            .tickFormat( (d) => d + "%")
            .tickSize(legendCellHeight*-1)


        /* Output counties */
        svg.selectAll("path")
            .data(counties)
            .enter()
            .append("path")
            .attr("d", d3.geoPath())
            .attr("class", "county")
            .attr("data-fips", (d) => d.id)
            .attr("data-education", (d) => fipsHash[d.id][2])
            .style("fill", (d) => {
                let color = "darkgreen";
                for (let i = 0; i < degreeUnitTicks.length; i++) {
                    let currentTickValue = degreeUnitTicks[i];
                    let thisValue = fipsHash[d.id][2]
                    if (currentTickValue < thisValue) {
                        continue; //skip and keep search for the right tick
                    }
                    else {
                        color = getColor(i);
                        break;
                    }
                }
                return color;
            })
            .attr("transform", "translate(" + padding + "," + padding + ")")

            /** Tooltip */
            .on("mouseover", (d) => {
                tooltip.style("opacity", 0.8)
                .attr("id", "tooltip")
                .attr("data-education", fipsHash[d.id][2])
                .html( () => {
                    let county = fipsHash[d.id];
                    return county[0] + ", " + county[1] + ": " + county[2] + "%"; //county[0] is the county name, county[1] is the state, and county[2] is the bachelor's or higher value
                })     
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY - 5 + "px")
            })
            .on("mouseout", (d) => {
                tooltip.style("opacity", 0)
            });


        /* Output legend */
        let legend = svg.selectAll("g") //generate legend group
            .attr("id","legend")
            .data(colorArray) //use the color array as the dataset
            .enter()
            .append("g")
            .attr("transform", (d, i) => {
                "translate(" + padding*10 + i*legendCellWidth + "," + 0 +")"
            })

        legend.append("rect") //generate legend cells
            .attr("x", (d, i) => (padding*10) + legendCellWidth*i + 15) //place it in the top right location
            .attr("y", padding/2 - legendCellHeight) //line it up to above the axis
            .attr("width", legendCellWidth)
            .attr("height", legendCellHeight)
            .style("fill", (d) => d)

        legend.append("text") //generate legend text
            .attr("x", (d, i) => (padding*10) + legendCellWidth*i + 8) //place it a bit to the right of each legend cell
            .attr("y", padding/2 + legendCellHeight) //line it up below each legend cell
            .attr("font-size", "0.75em")
            .text( (d, i) => degreeUnitTicks[i] + "%")

        legend.append("line") //generate vertical lines
            .style("stroke", "black")
            .style("stroke-width", 1)
            .attr("x1", (d, i) => (padding*10) + legendCellWidth*i + 15)
            .attr("y1", padding/2 - legendCellHeight)
            .attr("x2", (d, i) => (padding*10) + legendCellWidth*i + 15)
            .attr("y2", padding/2)

        legend.append("line")
            .style("stroke", "black") //generate horizontal lines
            .style("stroke-width", 1)
            .attr("x1", (d, i) => (padding*10) + legendCellWidth*i + 15)
            .attr("y1", padding/2)
            .attr("x2", (d, i) => (padding*10) + legendCellWidth*(i+1) + 15)
            .attr("y2", padding/2)

        svg.append("legend") //output legend group
    })

    /** Log errors */
    .catch((error) => {
        console.log(error);
    })


/*** To-do's */
/*
[X] Study data
    [X] Education data uses fips, which matches the id used in topology data
[X] Fetch data
    [X] Use Promise
[X] Link to example assignment: https://codepen.io/freeCodeCamp/full/EZKqza
[X] Use better gradient (Color Brewer)
[X] Implement legend cells
[X] Implement tooltip
[ ] Debug 
    [ ] Get rid of space before 3%
    [ ] Get rid of line after 66%
    [ ] Extend the space after 66% to align with cell width
[X] Optimize
    [X] Figure out how I can use a hash table to speed up lookup performance
*/
