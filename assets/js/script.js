const apikey = "68b83ae1e2bfeb301dd9fe8141c38278";
const clearHistoryBtnEl = document.querySelector(".clear-history");
const getHistory = document.querySelector("#get-history");
let today = new Date();
let futureWeatherEl = "";


const searchBtnEl = document.querySelector(".search-icon");
searchBtnEl.addEventListener("click", userInput);
clearHistoryBtnEl.addEventListener("click", clearHistory)

function userInput(){

    let userCity = document.querySelector("#search-text").value.toLowerCase();
    let cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + apikey;
    locationFinder(cityURL);
    updateHistory(userCity);
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

    let currentDisplay = document.querySelector(".main-display");
    
    let mainContentEl = document.createElement("div");    
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
    document.querySelector(".weather-card").textContent = "";
    for(let i = 1; i <=5 ; i++){
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

function updateHistory(userCity){
    document.querySelector("#get-history").textContent = "";
    let storage = JSON.parse(localStorage.getItem("userInput"));
    let object;
    if(storage != null){
        storage.push(userCity);
        object = storage
      } else {
        object = [userCity];
      }
      var jsonObject = JSON.stringify(object);
      localStorage.setItem("userInput", jsonObject);
      console.log(storage.length);

    for(i=1 ; i<storage.length ; i++){
        let storage = JSON.parse(localStorage.getItem("userInput"));
        let displayHistory = document.createElement("div");
        let updateItem =
        `<button class="history-item">${storage[i]}</button>`;

        displayHistory.innerHTML = updateItem;
        getHistory.appendChild(displayHistory);
    }

    }

    function clearHistory(){
        localStorage.clear("userCity");
        localStorage.removeItem("userCity");
        updateHistory();
    }
