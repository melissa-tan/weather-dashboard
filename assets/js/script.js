const apikey = "68b83ae1e2bfeb301dd9fe8141c38278";
let today = new Date();


const searchBtnEl = document.querySelector(".search-icon");
searchBtnEl.addEventListener("click", userInput);

function userInput(){
    let userCity = document.querySelector("#search-text").value.toLowerCase();
    let cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + apikey;
    console.log(cityURL)
    locationFinder(cityURL);
}

function locationFinder(cityURL){
    fetch(cityURL)
    .then(response => {
        return response.json();
    })
    .then(data => {
        weatherInfo(data);
    });
}

function weatherInfo (data){
    let lon = data.coord.lon
    let lat = data.coord.lat
    let apiCity = data.name;
    let weatherInfoURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts&appid="+ apikey;
    console.log(weatherInfoURL);

    fetch(weatherInfoURL)
    .then(function(response2){
        return response2.json();
    })
    .then(function (data2){
        getCurrentWeather(data2, apiCity);
    });
}

function getCurrentWeather(data2, apiCity){
    let temp = data2.current.temp;
    let humid = data2.current.humidity;
    let windSpeed = data2.current.wind_speed;
    let uvIndex = data2.current.uvi;
    let icon = data2.current.weather[0].icon;
    let iconText = data2.current.weather[0].main;

    console.log(temp, humid, windSpeed, uvIndex)
    let currentDisplay = document.querySelector(".main-display");
    
    let mainContentEl = document.createElement("div");
    /* mainContentEl.classlist.add("main-display"); */
    
    let mainContent = 
        `<div class="title"> ${apiCity}</div>
        <img src= "http://openweathermap.org/img/wn/${icon}@2x.png" alt="${iconText}">
        <div class="main-info" id="temperature">Temperature: ${temp}</div>
        <div class="main-info" id="humidity">Humidity: ${humid}%</div>
        <div class="main-info" id="wind-speed">Wind Speed: ${windSpeed}</div>
        <div class="main-info" id="uv">UV Index: ${uvIndex}</div>`;
    
    mainContentEl.innerHTML = mainContent;
    mainContentEl.classList.add("main-display");

    currentDisplay.parentNode.replaceChild(mainContentEl,currentDisplay);
    for(let i = 1; i < 6; i++){
        let futureDate = new Date(today);
        let dateFormat = {year: "numeric", month: "numeric", day: "numeric"};
        futureDate.setDate(today.getDate() + i);
    
        currentCardEl = document.querySelector(".card");
        futureWeatherEl = document.createElement("div");
        futureWeatherEl.classList.add("card");
        const weekDay = `${futureDate.toLocaleDateString("en-US", {weekday: "long"})} <br> ${futureDate.toLocaleDateString("en-US", dateFormat)}`
        const futureTemp = data2.daily[i].temp.max;
        const futureHumid = data2.daily[i].humidity;
        const futureIcon = data2.daily[i].weather[0].icon;
        const futureIconText = data2.daily[i].weather[0].main;
    
        let updateCard = 
        `<div class="card-title">${weekDay}</div>
        <img src= "http://openweathermap.org/img/wn/${futureIcon}@2x.png" alt="${futureIconText}">
        <div class="card-info card-temp">Temp: ${futureTemp}</div>
        <div class="card-info card-humidity">Humidity: ${futureHumid}%</div>`
        
        futureWeatherEl.innerHTML = updateCard;
        futureWeatherEl.classList.add("card");
    
        document.querySelector(".weather-card").appendChild(futureWeatherEl);
    }
}





