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

const getProperty = (arrayToSearch, fipsToFind, propertyName) => { //Use this function to return a property value from the matching element education data array, given a fips value to search
    for (let i = 0; i < arrayToSearch.length; i++) { //iterate through array
       if (arrayToSearch[i].fips == fipsToFind) { //compare each item's fip to fipToFind
           return arrayToSearch[i][propertyName]; //if it's a match, return the value associated with item[propertyName]
       }
    } 
};

const getAllProperties = (arrayToSearch, fipsToFind) => { //Use this function to return all property values from the matching element in education data array, given a fips value to search
    for (let i = 0; i < arrayToSearch.length; i++) { //iterate through array
       if (arrayToSearch[i].fips == fipsToFind) { //compare each item's fip to fipToFind
            let area = arrayToSearch[i];
            let array = new Array(area.area_name, area.state, area.bachelorsOrHigher)
            return array; //if it's a match, return the value associated with item[propertyName]
       }
    } 
};

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
            .attr("data-education", (d) => getProperty(educationData, d.id, "bachelorsOrHigher"))
            

            .style("fill", (d) => {
                let color = "darkgreen";
                for (let i = 0; i < degreeUnitTicks.length; i++) {
                    let currentTickValue = degreeUnitTicks[i];
                    let thisValue = getProperty(educationData, d.id, "bachelorsOrHigher");
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
                .attr("data-education", getProperty(educationData, d.id, "bachelorsOrHigher"))
                .html( () => {
                    let area = getAllProperties(educationData, d.id);
                    return area[0] + ", " + area[1] + ": " + area[2] + "%";
                })     
                .style("left", d3.event.pageX + 5 + "px")
                .style("top", d3.event.pageY - 5 + "px")
            })
            .on("mouseout", (d) => {
                tooltip.style("opacity", 0)
            });


        /* Output legend cells */
        svg.append("g")
            .attr("id","legend")
            .selectAll("rect")
            .data(colorArray) //use the color array as the dataset
            .enter() 
            .append("rect")
            .attr("x", (d, i) => (padding*10) + legendCellWidth*i + 15) //place it in the top right location
            .attr("y", padding/2 - legendCellHeight) //line it up to above the axis
            .attr("width", legendCellWidth)
            .attr("height", legendCellHeight)
            .style("fill", (d) => d);

        /* Output legend axis*/
        svg.append("g")
            .attr("transform", "translate(" + padding*10 + "," + padding/2 + ")")
            .call(legendAxis)


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
[ ] Use d3 gradient library for a better gradient scale
[X] Implement legend cells
[X] Implement tooltip
[ ] Debug 
    [ ] Get rid of space before 3%
    [ ] Get rid of line after 66%
    [ ] Extend the space after 66% to align with cell width
[ ] Optimize
    [ ] Figure out how I can use a hash table to speed up lookup performance
*/
