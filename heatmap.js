'use strict';

/*** Initialize global variables */
let dataset = [];

/*** Heatmap code */
/** Fetch data */
fetch('tps://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(response => response.json())
    .then(data => dataset = data.slice())
    .then(() => {

    }