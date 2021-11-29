// 'use strict';

const families = require('./families');
const fetch = require("node-fetch");

function findDuplicate(data) {
    const result = [];
    data.forEach((item) => {
        if (result.indexOf(item) === -1 && data.filter((i) => i === item).length > 1) {
            result.push(item);
        }
    });
    return result;
}

const apikey = process.env.W3CAPIKEY;
const fetchSeries = (url, page = 1, previousResponse = []) => {
    return fetch(`${url}&page=${page}`)
        .then(response => response.json())
        .then((response2) => {
            const response = [...previousResponse, ...response2._links['specification-series']];
            if (page < response2.pages) {
                return fetchSeries(url, page + 1, response);
            }
            return response;
        });
    };

(async function() {
    const W3CSeries = await fetchSeries(`https://api.w3.org/specification-series?apikey=${apikey}&retired=false`);
    const W3CSeriesTitles = W3CSeries.map((item) => item.title);
    let hasErrors = false;

    // check family name uniqueness
    const duplicateFamilyNames = findDuplicate(families.map((f) => f.name));
    if (duplicateFamilyNames.length > 0) {
        console.error(`* Duplicate family names: ${duplicateFamilyNames}`);
        hasErrors = true;
    }

    // check series uniqueness
    const series = [].concat(...families.map(family => family.series));
    const duplicateSeries = findDuplicate(series);
    if (duplicateSeries.length > 0) {
        console.error(`* Duplicate series: ${duplicateSeries}`);
        hasErrors = true;
    }

    // check that all series from the API are listed in the families.json
    let diff = W3CSeriesTitles.filter(s => !series.includes(s));
    if (diff.length > 0) {
        console.error(`* The following series are missing from families.json: ${diff}`);
        hasErrors = true;
    }

    // check that all series from the families.json are listed in the API
    diff = series.filter(s => !W3CSeriesTitles.includes(s));
    
    if (diff.length > 0) {
        console.error(`* The following series are unknown to the W3C API: ${diff}`);
        hasErrors = true;
    }

    if (hasErrors) {
        process.exit(1);
    };

}());


