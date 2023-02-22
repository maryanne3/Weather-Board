//variables 
$(document).ready(function() {


const APIKey = "bd5e378503939ddaee76f12ad7a97608";

var currentURL =  "https://api.openweathermap.org/data/2.5/weather?q="
var urlFiveDay = "https://api.openweathermap.org/data/2.5/forecast?q=" 


function getWeather(city) {
  var responseData = {};

  // API Call Forecast
  $.ajax({
    url: currentURL + "weather",
    method: "GET",
    data: {
      q: city,
      units: units,
      appid: APIKey,
    }});
  $.ajax({
    url: urlFiveDay, method: "GET" })
  .then(function(response) {
    responseData.current = response;

    $.ajax({
      url: currentURL + "forecast",
      method: "GET",
      data: {
        q: city,
        units: units,
        appid: APIKey
      }
    }).then(function(response) {
      responseData.forecast = response;
      displayForecast(responseData);
  });
  })};
  var coordinates = {
    lat: responseData.current.coord.lat,
    lon: responseData.current.coord.lon
  }

  getUVindex(coordinates);
  displayCurrentWeather(responseData);

  function displayCurrentWeather(data) {

    $("#city").text(data.current.name);
    $("#conditions").text(data.current.weather[0].main);
    $("#temperature").text(`${parseInt(data.current.main.temp)}\u00B0 F`);
    $("#humidity").text(`${data.current.main.humidity}%`);
    $("#wind-speed").text(`${data.current.wind.speed} mph`)

  }

  getWeather(city);
  $("#search-history").on("click", ".search-item", function() {
    getWeather($(this).text());
  
})});