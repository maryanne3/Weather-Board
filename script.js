//variables 
const searchCity = document.querySelector('.searchCity')
const weathersContainer = $("#weather-container");
const searchButton = $(".searchButton");
const queryURL = "";
const apiKey = "bd5e378503939ddaee76f12ad7a97608";
const getCurrentData = function (name, forecastData) {
    return {
      name: name,
      temperature: forecastData.current.temp,
      wind: forecastData.current.wind_speed,
      humidity: forecastData.current.humidity,
      uvi: forecastData.current.uvi,
      date: getFormattedDate(forecastData.current.dt, "- dddd - DD/MM/YYYY - HH:mm"),
      iconCode: forecastData.current.weather[0].icon,
    };
  };



//Function call for forecast-data 


