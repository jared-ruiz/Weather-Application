//query selectors
var locationSubmit = document.querySelector("#weather-form");
var weatherLocation = document.querySelector("#weather-submit");
var fiveDayContainer = document.querySelector("#weather-container");

//get geo location (lon lat) of city through geo api
var getGeoLocation = function(event) {
    //prevent refresh upon click
    event.preventDefault();
    
    //take text value from submission and assign it to location variable
    var location = weatherLocation.value.trim();
    console.log(location);
    
    //weather geolocation api url
    var geoApiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + location + "&appid=a300dca41d6e74f50cc4699c6a1dda0f";

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
        createCardEl.appendChild(createTempEl);
        createCardEl.appendChild(createWindEl);
        createCardEl.appendChild(createHumidEl);

        createWeatherEl.appendChild(createCardEl);
        fiveDayContainer.appendChild(createWeatherEl);
    }
}


locationSubmit.addEventListener("submit", getGeoLocation);