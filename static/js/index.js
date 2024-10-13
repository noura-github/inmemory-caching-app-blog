
document.addEventListener('DOMContentLoaded', function() {
   loadCountry();

}, false);

function loadCountry() {
  let storedCountry = localStorage.getItem("country");
  console.log("Value of country in localStorage is:", storedCountry)
  console.log(document.getElementById("selectCountry").value)
  if (storedCountry){
     document.getElementById("selectCountry").value = storedCountry;
  } else {
     localStorage.setItem("country", document.getElementById("selectCountry").value);
  }
}

function onChangeCountry(){
    let selValue = document.getElementById("selectCountry").value;
    console.log("Store the value:",selValue, " in localStorage")
    localStorage.setItem("country", document.getElementById("selectCountry").value);

    let id = document.getElementById("selectCountry").value;
    let country_detail = localStorage.getItem(id);
    console.log("country_detail:", country_detail);
    if (country_detail){
        createCountryDetailTable(JSON.parse(country_detail));
    } else {
        getCountryDetail(document.getElementById("selectCountry").value);
    }
}

function getCountryDetail(countryId) {
    const dataToSend = {
        countryId: countryId
    };

    // Sending a POST request using fetch
    fetch('/process_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        localStorage.setItem(data.country_detail["Id"], JSON.stringify(data.country_detail));
        createCountryDetailTable(data.country_detail);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function createCountryDetailTable(country_detail){
    let table = document.getElementById("country_table");
    let tBody = table.getElementsByTagName('tbody')[0];
    let country_name = country_detail["Name"];
    let rouwFound = findRow(tBody, country_name);

    if (!rouwFound){
        let tr = document.createElement('tr');
        addCell(tr, country_name);
        addCell(tr, country_detail["Capital"]);
        addCell(tr, country_detail["Population"]);
        addCell(tr, country_detail["Area"]);
        addCell(tr, country_detail["Dialing_code"]);

        tBody.appendChild(tr);
    }
}

function findRow(tBody, country_name) {
    let tableRow = tBody.getElementsByTagName('tr');
    for (let row of tableRow){
        let tableCell = row.getElementsByTagName('td');
        for (let cell of tableCell){
            if (cell.innerHTML == country_name) {
                return true;
            }
        }
    }
    return false;
}

function addCell(tr, item){
    var td = document.createElement('td');
    var content = document.createTextNode(item);
    td.appendChild(content);
    tr.appendChild(td);
}