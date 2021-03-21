const apikey = "68b83ae1e2bfeb301dd9fe8141c38278";
const clearHistoryBtnEl = document.querySelector(".clear-history");
const getHistory = document.querySelector("#get-history");
let today = new Date();
let futureWeatherEl = "";
const searchBtnEl = document.querySelector(".search-icon");
searchBtnEl.addEventListener("click", getCity);
clearHistoryBtnEl.addEventListener("click", clearHistory);
const reloadHistoryEl = document.querySelector(".history-item");


function getCity(event){
    console.log(event.target.getAttribute("data-id"));
    if(event.target.getAttribute("data-id")){
        userCity=event.target.getAttribute("data-id");
    }else{
        userCity = document.querySelector("#search-text").value.toLowerCase();
    }
    console.log(userCity)
    userInput(userCity);

    // if (document.querySelector("#search-text").value != ""){
    //     let userCity = document.querySelector("#search-text").value.toLowerCase();
    //     userInput(userCity);
    // }else{
    //     let userCity = reloadHistoryEl.value;
    //     console.log(userCity);
    //     userInput(userCity);
    // }
    
}


function userInput(userCity){
    let cityURL = "http://api.openweathermap.org/data/2.5/weather?q=" + userCity + "&appid=" + apikey;
    locationFinder(cityURL,userCity); 
}

function locationFinder(cityURL,userCity){
    fetch(cityURL)
    .then(response => {
        if(response.ok){
            return response.json();
        }else{
            throw new Error("Please input valid city");
        }
    })
    .then(data => {
        weatherInfo(data);
        updateHistory(userCity);
    })
    .catch(error=>{
        alert(error);
    });
}

function weatherInfo (data){
    let lon = data.coord.lon
    let lat = data.coord.lat
    let apiCity = data.name;
    let weatherInfoURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" +lat+"&lon="+lon+"&units=imperial&exclude=minutely,hourly,alerts&appid="+ apikey;

    fetch(weatherInfoURL)
    .then(function(response2){
        console.log(response2)
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
    let uvIndex = uvColor(data2.current.uvi);
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
    let cityHistory=[userCity];
    if(storage != null){
        storage.forEach(city=>{
            if (city !== userCity){
                cityHistory.push(city);
            }
        })
    }
      var jsonObject = JSON.stringify(cityHistory);
      localStorage.setItem("userInput", jsonObject);
    getHistory.innerHTML="";
    cityHistory.forEach(city=>{

        let displayHistory = document.createElement("div");
        let updateItem =
        `<button class="history-item btn" data-id="${city}"onclick="getCity(event)">${city}</button>`;
        displayHistory.innerHTML = updateItem;
        getHistory.appendChild(displayHistory);
    })
    
   /*  const reloadHistoryEl = document.querySelector(".history-item");
    console.log(reloadHistoryEl)
    reloadHistoryEl.addEventListener("click", getCity, false); */
}

function clearHistory(){
    localStorage.clear("userCity");
    localStorage.removeItem("userCity");
    getHistory.innerHTML="";
}

function uvColor(uvi){
    let uv;
    if(uvi < 3){
        uv = `<span class="low"> ${uvi} </span>`
    } else if (uvi < 6){
        uv = `<span class="moderate"> ${uvi} </span>`
    } else if (uvi<8){
        uv = `<span class="high"> ${uvi} </span>`
    } else if (uvi<11){
        uv = `<span class="very-high"> ${uvi} </span>`
    } else{
        uv = `<span class="extreme"> ${uvi} </span>`
    }
    return uv;
}