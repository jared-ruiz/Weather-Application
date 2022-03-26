var searchHistory = [];

//query selectors
var locationSubmit = document.querySelector("#weather-form");
var weatherLocation = document.querySelector("#weather-submit");
var fiveDayContainer = document.querySelector("#weather-container");
var buttonDiv = document.querySelector("#button-folder");
var currentWeather = document.querySelector("#forcast-info");
var buttonFolder = document.querySelector("#button-folder");
var searchButton = document.querySelector("#search-btn");
var historyButtons = document.querySelector(".search-buttons");

//get geo location (lon lat) of city through geo api
var getGeoLocation = function(event) {
    //prevent refresh upon click
    event.preventDefault();
    
    //clear recent weather information
    currentWeather.innerHTML = "";
    fiveDayContainer.innerHTML = "";

    
    //take text value from submission and assign it to location variable
    var location = weatherLocation.value.trim();
    console.log(location);
    // weatherLocation.value = "";
    
    //weather geolocation api url
    var geoApiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + location + "&appid=a300dca41d6e74f50cc4699c6a1dda0f";

    //make request to url
    fetch(geoApiUrl)
    .then(function(response) {
        //if location exists return non 404 error
        if (response.ok) {
            //convert response to json
            response.json().then(function(data) {
                //get lon and lat variables 
                var lon = data[0].lon;
                var lat = data[0].lat
                console.log(data);
                
                //pass variables into display function
                getWeaterInfo(lon, lat);
            });
        }
        else {
            //alert if city/state doesnt exist
            alert("Error: City/State Not Found");
        }
    })

    //catch rejected promises to api fetch
    .catch(function(error) {
        alert("Unable to connect to weather API");
    })
}

var getWeaterInfo = function(lon, lat) {
    
    //confirm that lon and lat are passing through
    console.log(lon);
    console.log(lat);
    
    //weather api url
    var weatherApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=a300dca41d6e74f50cc4699c6a1dda0f";

    //make request to url
    fetch(weatherApiUrl)
    .then(function(response) {
        //if weather for location exists
        if (response.ok) {
            //convert response to json
            response.json().then(function(data) {
                //retrieve weather json object
                console.log(data)
                //pass object to weatherInfo();
                weatherInfo(data);
                // console.log(data.daily[0].temp.day);
            });
        }
    })
}

//take finalized json and print all necesssary information to dom
var weatherInfo = function(data) {
    //confirm object passed successfully
    console.log(data);

    //get current date for current day card (ex: 3/14/2022)
    var currentDate = new Date();
    console.log(currentDate);

    //print 5 day forcast
    for (var i = 1; i < 6; i++) {
        //make card div container
        var createWeatherEl = document.createElement("div");
        createWeatherEl.setAttribute("class", "card border border-dark");
        
        //make card body div
        var createCardEl = document.createElement("div");
        createCardEl.setAttribute("class", "card-body");
        
        //make date element
        var createDateTitle = document.createElement("h5");
        createDateTitle.setAttribute("class", "card-title");
        
        //probably overly complicated way of calculating 5 days in future using unix time conversion
        var unixTime = data.daily[i].dt;
        var unixMili = unixTime * 1000;
        var unixTimeObj = new Date(unixMili);
        var convertedTime = unixTimeObj.toDateString("en-US");

        createDateTitle.textContent = convertedTime;
        
        //create temp/wind/humidity elements
        var createTempEl = document.createElement("p");
        var createWindEl = document.createElement("p");
        var createHumidEl = document.createElement("p");
        var createIconEl = document.createElement("img");

        //create image src with specific weather forcast icons
        console.log(data.daily[i].weather[0].icon);
        createIconEl.setAttribute("src", "http://openweathermap.org/img/w/" + data.daily[i].weather[0].icon + ".png");

        
        //assign class to temp element + add daily temp
        createTempEl.setAttribute("class", "card-text");
        createTempEl.setAttribute("id", "temp");
        var dailyTemp = data.daily[i].temp.day;
        createTempEl.textContent = "Temp: " + dailyTemp + " F";
        
        console.log(data.daily[i].temp.day);
        
        createWindEl.setAttribute("class", "card-text");
        createWindEl.setAttribute("id", "wind");
        var dailyWind = data.daily[i].wind_speed;
        createWindEl.textContent = "Wind Speed: " + dailyWind + "MPH";

        createHumidEl.setAttribute("class", "card-text");
        createHumidEl.setAttribute("id", "humidity");
        var dailyHumid = data.daily[i].humidity;
        createHumidEl.textContent = "Humidity: " + dailyHumid + "%";

        createCardEl.appendChild(createDateTitle);
        createCardEl.appendChild(createIconEl);
        createCardEl.appendChild(createTempEl);
        createCardEl.appendChild(createWindEl);
        createCardEl.appendChild(createHumidEl);

        createWeatherEl.appendChild(createCardEl);
        fiveDayContainer.appendChild(createWeatherEl);
    }

    //after 5 day loop, add current day weather forcast
    var forcastDiv = document.createElement("div");
    var forcastDate = document.createElement("h5");
    var forcastIcon = document.createElement("img");
    var forcastTemp = document.createElement("p");
    var forcastWind = document.createElement("p");
    var forcastHumidity = document.createElement("p");
    var forcastUvi = document.querySelector("p");

    //create forcast div
    forcastDiv.setAttribute("class", "card-body");

    //add date class
    forcastDate.setAttribute("class", "card-title");

    //set date
    var unixTime = data.daily[0].dt;
        var unixMili = unixTime * 1000;
        var unixTimeObj = new Date(unixMili);
        var convertedTime = unixTimeObj.toDateString("en-US");

        forcastDate.textContent = convertedTime;

        //create image src with specific weather forcast icons
        console.log(data.daily[0].weather[0].icon);
        forcastIcon.setAttribute("src", "http://openweathermap.org/img/w/" + data.daily[0].weather[0].icon + ".png");

        //assign class to temp element + add daily temp
        forcastTemp.setAttribute("class", "card-text");
        forcastTemp.setAttribute("id", "temp");
        var dailyTemp = data.daily[0].temp.day;
        forcastTemp.textContent = "Temp: " + dailyTemp + " F";

        //assign forcast wind attributes and classes
        forcastWind.setAttribute("class", "card-text");
        forcastWind.setAttribute("id", "wind");
        var dailyWind = data.daily[0].wind_speed;
        forcastWind.textContent = "Wind Speed: " + dailyWind + "MPH";

        //assign forcast hunmidity attributes and classes
        forcastHumidity.setAttribute("class", "card-text");
        forcastHumidity.setAttribute("id", "humidity");
        var dailyHumid = data.daily[0].humidity;
        forcastHumidity.textContent = "Humidity: " + dailyHumid + "%";

        //make sure it has no classes when being made
        forcastUvi.removeAttribute("class");

        forcastUvi.setAttribute("class", "card-text");
        forcastUvi.setAttribute("id", "humidity");
        var dailyUvi = data.daily[0].uvi;
        forcastUvi.textContent = "UVI: " + dailyUvi;

        console.log(data.daily[0].uvi);

        //assign color indicators to uvi
        if (0 <= data.daily[0].uvi && data.daily[0].uvi <= 2) {
            forcastUvi.setAttribute("class", "success");
        }
        else if(3 <= data.daily[0].uvi && data.daily[0].uvi <= 5) {
            forcastUvi.setAttribute("class", "warning");
        }
        else {
            forcastUvi.setAttribute("class", "danger");
        }


        forcastDiv.appendChild(forcastDate);
        forcastDiv.appendChild(forcastIcon);
        forcastDiv.appendChild(forcastTemp);
        forcastDiv.appendChild(forcastWind);
        forcastDiv.appendChild(forcastHumidity);
        forcastDiv.appendChild(forcastUvi);

        //append current day weather
        currentWeather.appendChild(forcastDiv);

}

//create buttons for search history
var setHistory = function() {
    
    var city = weatherLocation.value.trim();
    console.log(searchHistory);

    //push city into searchHistory Array
    searchHistory.push(city);
    localStorage.setItem("Search History", JSON.stringify(searchHistory));
    renderButtons();
}

var renderButtons = function() {
    searchHistory = [];
    var cityArray = localStorage.getItem("Search History");
    if (cityArray) {
        cityArray = JSON.parse(cityArray);
        console.log(cityArray);
        searchHistory = cityArray;
        console.log(searchHistory);
    }
    else {
        return;
    }
    
    console.log(cityArray, typeof cityArray);
    buttonDiv.innerHTML = "";

    for (var i = 0; i < cityArray.length; i++) {
        
        //create button with class
        var buttonCreateEl = document.createElement("button");
        buttonCreateEl.setAttribute("class", "m-1 btn bg-secondary bg-gradient fw-bold search-buttons");    
        
        //need event listener upon button creation as opposed to adding it post
        buttonCreateEl.addEventListener("click", printText);
        buttonCreateEl.setAttribute("value", cityArray[i]);
        buttonCreateEl.innerText = cityArray[i];

        buttonDiv.append(buttonCreateEl);
    }
}

var printText = function(event) {
    var buttonText = this.value;
    console.log(buttonText);
    weatherLocation.value = buttonText;
}

// checkLocal();
renderButtons();
locationSubmit.addEventListener("submit", setHistory);
locationSubmit.addEventListener("submit", getGeoLocation);