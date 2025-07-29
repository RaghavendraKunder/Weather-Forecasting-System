let vantaEffect = null;

const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherDiv = document.querySelector(".current-weather");
const weatherCardsDiv = document.querySelector(".weather-cards");
const API_KEY = "a2bb5ea2de8cdc46112570d6e1bbbae4"; // API key for OpenWeatherMap API
const createWeatherCard = (cityName, weatherItem, index) => {
if(index === 0) { // HTML for the main weather card
return `<div class="details">
<h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
<h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
<h6>Wind: ${weatherItem.wind.speed} M/S</h6>
<h6>Humidity: ${weatherItem.main.humidity}%</h6>
</div>
<div class="icon">
<img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
<h6>${weatherItem.weather[0].description}</h6>
</div>`;
} else { // HTML for the other five day forecast card
return `<li class="card">
<h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
<img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
<h6>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
<h6>Wind: ${weatherItem.wind.speed} M/S</h6>
<h6>Humidity: ${weatherItem.main.humidity}%</h6>
</li>`;
}
}
const getWeatherDetails = (cityName, latitude, longitude) => {
const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
fetch(WEATHER_API_URL).then(response => response.json()).then(data => {
// Filter the forecasts to get only one forecast per day
const uniqueForecastDays = [];
const fiveDaysForecast = data.list.filter(forecast => {
const forecastDate = new Date(forecast.dt_txt).getDate();
if (!uniqueForecastDays.includes(forecastDate)) {
return uniqueForecastDays.push(forecastDate);
}
});
// Clearing previous weather data
cityInput.value = "";
currentWeatherDiv.innerHTML = "";
weatherCardsDiv.innerHTML = "";
const weatherMain = fiveDaysForecast[0].weather[0].main.toLowerCase();
setWeatherBackground(weatherMain);

// Creating weather cards and adding them to the DOM
fiveDaysForecast.forEach((weatherItem, index) => {
const html = createWeatherCard(cityName, weatherItem, index);
if (index === 0) {
currentWeatherDiv.insertAdjacentHTML("beforeend", html);
} else {
weatherCardsDiv.insertAdjacentHTML("beforeend", html);
}
});
}).catch(() => {
alert("An error occurred while fetching the weather forecast!");
});
}
const getCityCoordinates = () => {
const cityName = cityInput.value.trim();
if (cityName === "") return;
const API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
// Get entered city coordinates (latitude, longitude, and name) from the API response
fetch(API_URL).then(response => response.json()).then(data => {
if (!data.length) return alert(`No coordinates found for ${cityName}`);
const { lat, lon, name } = data[0];
getWeatherDetails(name, lat, lon);
}).catch(() => {
alert("An error occurred while fetching the coordinates!");
});
}
const getUserCoordinates = () => {
navigator.geolocation.getCurrentPosition(
position => {
const { latitude, longitude } = position.coords; // Get coordinates of user location
// Get city name from coordinates using reverse geocoding API
const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
fetch(API_URL).then(response => response.json()).then(data => {
const { name } = data[0];
getWeatherDetails(name, latitude, longitude);
}).catch(() => {
alert("An error occurred while fetching the city name!");
});
},
error => { // Show alert if user denied the location permission
if (error.code === error.PERMISSION_DENIED) {
alert("Geolocation request denied. Please reset location permission to grant access again.");
} else {
alert("Geolocation request error. Please reset location permission.");
}
});
}
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());

function setWeatherBackground(condition) {
  const element = document.getElementById("vanta-bg");

  if (vantaEffect) {
    vantaEffect.destroy(); // Remove existing effect if any
    vantaEffect = null;
  }

  if (condition.includes("rain") || condition.includes("cloud")) {
    vantaEffect = VANTA.CLOUDS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      skyColor: 0x6c7a89,
      cloudColor: 0xdfe6e9,
      speed: 0.6,
    });
  } else if (condition.includes("clear") || condition.includes("sun")) {
    element.style.background = "linear-gradient(to top right, #fceabb, #f8b500)";
  } else if (condition.includes("snow")) {
    element.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)";
    // Optional: Add snowflake animation
  } else {
    element.style.background = "linear-gradient(to right, #d3ecff, #e8f7ff)";
  }
}
// Your other functions...

// Paste it HERE
function setWeatherBackground(condition) {
  const element = document.getElementById("vanta-bg");

  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }

  // Normalize input
  condition = condition.toLowerCase();

  if (condition.includes("clear") || condition.includes("sun")) {
    element.style.background = "linear-gradient(to top right, #fceabb, #f8b500)";
  } else if (condition.includes("cloud")) {
    element.style.background = "linear-gradient(to top, #d7d2cc, #304352)";
  } else if (condition.includes("rain") || condition.includes("drizzle")) {
    vantaEffect = VANTA.CLOUDS({
      el: "#vanta-bg",
      mouseControls: true,
      touchControls: true,
      minHeight: 200.00,
      minWidth: 200.00,
      skyColor: 0x5c6e91,
      cloudColor: 0x4e5d6c,
      speed: 0.5,
    });
  } else if (condition.includes("snow")) {
    element.style.background = "linear-gradient(to bottom, #e0eafc, #cfdef3)";
  } else if (condition.includes("thunderstorm")) {
    element.style.background = "linear-gradient(to right, #2c3e50, #000000)";
  } else if (condition.includes("mist") || condition.includes("fog") || condition.includes("haze") || condition.includes("smoke")) {
    element.style.background = "linear-gradient(to right, #757f9a, #d7dde8)";
  } else if (condition.includes("wind")) {
    element.style.background = "linear-gradient(to right, #89f7fe, #66a6ff)";
  } else {
    element.style.background = "linear-gradient(to right, #d3ecff, #e8f7ff)";
  }
}
