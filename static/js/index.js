
// An object to store cached data
const cache = {};

// Url to get data from back-end
const apiUrl = "/load_film_data";

document.addEventListener('DOMContentLoaded', function() {
    onChangeJBFilm();
}, false);


async function onChangeJBFilm(){
    let filmId = document.getElementById("selectFilm").value;

    // Case1: Using In-Memory Caching
    let film_data = await fetchFilmDataInMemCache(apiUrl, filmId);

    // Case 2: Caching using attribute data of an Element
    //let film_data = await fetchFilmDataElemCache(apiUrl, filmId);

    // Log the found data
    console.log("Film data: ", film_data);

    // Call the function with the URL and Id
    showMovieData(film_data);
}

// An async function that fetches data from a URL or in memory chache
async function fetchFilmDataInMemCache(url, filmId) {

    //Define cache key as combination of url and the film ID
    let cacheKey = url+filmId;

    // Check if data is already in cache to return it
    if (cache[cacheKey]) {
        console.log('Returning cached data');
        return cache[cacheKey];
    }

    console.log("Fetching data...");
    let dataToSend = {filmId: filmId}
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        }
    );

    // Await the fetch request & throw an error if status is not ok
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Await the parsing of the response as JSON
    const data = await response.json();

    // Store the fetched data in cache
    cache[cacheKey] = data.film_data;
    return data.film_data;
}



// An async function that fetches data from a URL or an element cache
async function fetchFilmDataElemCache(url, filmId) {

    // Select the element
    let element = document.getElementById('selectFilm');

    //Get the selected option
    var option = element.options[element.selectedIndex];

    // Access data attributes using the dataset property
    let filmData = option.dataset.filmData;

    // Check if data is already in cache to return it
    if (filmData) {
        console.log('Returning cached data');
        return JSON.parse(filmData);
    }

    console.log("Fetching data...");
    let dataToSend = {filmId: filmId}
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        }
    );

    // Await the fetch request & throw an error if status is not ok
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Await the parsing of the response as JSON
    const data = await response.json();

    // Store the fetched data in cache
    option.dataset.filmData = JSON.stringify(data.film_data);
    return data.film_data;
}


function showMovieData(film_data){
    let table = document.getElementById("film_table");
    let tBody = table.getElementsByTagName('tbody')[0];
    // Clear the tbody contents to create a new row
    tBody.innerHTML = "";
    let film_title = film_data["title"];

    //Add a new row
    let tr = document.createElement('tr');
    addCell(tr, film_title);
    addCell(tr, film_data["year"]);
    addCell(tr, film_data["starring"]);
    addCell(tr, film_data["directedBy"]);
    tBody.appendChild(tr);
}

function addCell(tr, item){
    var td = document.createElement('td');
    var content = document.createTextNode(item);
    td.appendChild(content);
    tr.appendChild(td);
}