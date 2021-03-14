const apikey = "68b83ae1e2bfeb301dd9fe8141c38278";
const tempCity = "auburn"

let lon;
let lat;
let cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + tempCity + "&appid=" + apikey;
console.log(cityURL);


// function locationFinder(cityURL){
    fetch(cityURL)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        let lon = data.coord.lon
        let lat = data.coord.lat
        let weatherInfoURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+"&lon="+lon+"&exclude=minutely,hourly,alerts&appid="+ apikey;
        
        fetch(weatherInfoURL)
        .then(function(response2){
            return response2.json();
        })
        .then(function (data2){
            console.log(data2);
        })
    });
//}

