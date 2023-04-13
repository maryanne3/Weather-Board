//variables
var weatherAPI = "788d5638d7c8e354a162d6c9747d1bdf";
var currentCity = "";
var lastCity = "";

// Get current weather conditions
var getCurrentWeather = (event) => {
  let city = $('#search-city').val();
  currentCity= $('#search-city').val();
  let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&APPID=" + weatherAPI;
  fetch(queryURL)
  .then(handleErrors)
  .then((response) => {
      return response.json();
  })

  // Save city to storage 
  .then((response) => { 
      saveCity(city);
      $('#search-error').text("");
      let currentWeatherIcon="https://openweathermap.org/img/w/" + response.weather[0].icon + ".png";
      let currentTimeUTC = response.dt;
      let currentTimeZoneOffset = response.timezone;
      let currentTimeZoneOffsetHours = currentTimeZoneOffset / 60 / 60;
      let currentMoment = moment.unix(currentTimeUTC).utc().utcOffset(currentTimeZoneOffsetHours);
      renderCities();
      getFiveDayForecast(event);
      $('#header-text').text(response.name);
      let currentWeatherHTML = `
          <h3>${response.name} ${currentMoment.format("(MM/DD/YY)")}<img src="${currentWeatherIcon}"></h3>
          <ul class="list-unstyled">
              <li>Temperature: ${response.main.temp}&#8457;</li>
              <li>Humidity: ${response.main.humidity}%</li>
              <li>Wind Speed: ${response.wind.speed} mph</li>
              <li id="uvIndex">UV Index:</li>
          </ul>`;
      $('#current-weather').html(currentWeatherHTML);
      let latitude = response.coord.lat;
      let longitude = response.coord.lon;
      let uvQueryURL = "api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&APPID=" + weatherAPI;
      uvQueryURL = "https://cors-anywhere.herokuapp.com/" + uvQueryURL;
      fetch(uvQueryURL)
      .then(handleErrors)
      .then((response) => {
          return response.json();
      })
      .then((response) => {
          let uvIndex = response.value;
          $('#uvIndex').html(`UV Index: <span id="uvVal"> ${uvIndex}</span>`);
          if (uvIndex>=0 && uvIndex<3){
              $('#uvVal').attr("class", "uv-favorable");
          } else if (uvIndex>=3 && uvIndex<8){
              $('#uvVal').attr("class", "uv-moderate");
          } else if (uvIndex>=8){
              $('#uvVal').attr("class", "uv-severe");
          }
      });
  })
}


// Get Five-day forecast 
var getFiveDayForecast = (event) => {
  let city = $('#search-city').val();
  let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial" + "&APPID=" + weatherAPI;
  fetch(queryURL)
      .then (handleErrors)
      .then((response) => {
          return response.json();
      })
      .then((response) => {
      let fiveDayForecastHTML = `
      <h2>5-Day Forecast:</h2>
      <div id="fiveDayForecastUl" class="d-inline-flex flex-wrap ">`;
      for (let i = 0; i < response.list.length; i++) {
          let dayData = response.list[i];
          let dayTimeUTC = dayData.dt;
          let timeZoneOffset = response.city.timezone;
          let timeZoneOffsetHours = timeZoneOffset / 60 / 60;
          let thisMoment = moment.unix(dayTimeUTC).utc().utcOffset(timeZoneOffsetHours);
          let iconURL = "https://openweathermap.org/img/w/" + dayData.weather[0].icon + ".png";
          if (thisMoment.format("HH:mm:ss") === "11:00:00" || thisMoment.format("HH:mm:ss") === "12:00:00" || thisMoment.format("HH:mm:ss") === "13:00:00") {
              fiveDayForecastHTML += `
              <div class="weather-card card m-2 p0">
                  <ul class="list-unstyled p-3">
                      <li>${thisMoment.format("MM/DD/YY")}</li>
                      <li class="weather-icon"><img src="${iconURL}"></li>
                      <li>Temp: ${dayData.main.temp}&#8457;</li>
                      <br>
                      <li>Humidity: ${dayData.main.humidity}%</li>
                  </ul>
              </div>`;
          }
      }
      fiveDayForecastHTML += `</div>`;

      $('#five-day-forecast').html(fiveDayForecastHTML);
  })
}
var handleErrors = (response) => {
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// Save new city to Storage
var saveCity = (newCity) => {
    let cityExists = false;
 for (let i = 0; i < localStorage.length; i++) {
        if (localStorage["cities" + i] === newCity) {
            cityExists = true;
            break;
        }
    } if (cityExists === false) {
        localStorage.setItem('cities' + localStorage.length, newCity);
    }
}

var renderCities = () => {
    $('#city-results').empty();
    if (localStorage.length===0){
        if (lastCity){
            $('#search-city').attr("value", lastCity);
        } else {
            $('#search-city').attr("value");
        }
    } else {
       let lastCityKey="cities"+(localStorage.length-1);
        lastCity=localStorage.getItem(lastCityKey);
        $('#search-city').attr("value", lastCity);
        for (let i = 0; i < localStorage.length; i++) {
            let city = localStorage.getItem("cities" + i);
            let cityEl;
            if (currentCity===""){
                currentCity=lastCity;
            }
            if (city === currentCity) {
                cityEl = `<button type="button" class="list-group-item list-group-item-action active">${city}</button></li>`;
            } else {
                cityEl = `<button type="button" class="list-group-item list-group-item-action">${city}</button></li>`;
            } 
            $('#city-results').prepend(cityEl);
        }
        if (localStorage.length>0){
            $('#clear-history').html($('<a id="clear-history" href="#">clear cities</a>'));
        } else {
            $('#clear-history').html('');
        }
    }
    
}
$('#search-button').on("click", (event) => {
event.preventDefault();
currentCity = $('#search-city').val();
getCurrentWeather(event);
});

$('#city-results').on("click", (event) => {
    event.preventDefault();
    $('#search-city').val(event.target.textContent);
    currentCity=$('#search-city').val();
    getCurrentWeather(event);
});

$("#clear-history").on("click", (event) => {
    localStorage.clear();
    renderCities();
});
renderCities();
getCurrentWeather();