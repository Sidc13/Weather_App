// WeatherAPI key
const apiKey = "2877ccd13e4143a8bb931919260601";

// Base API URL
const baseUrl = "http://api.weatherapi.com/v1";

//Body element for background visuals
const body = document.body; // Reference to body for background change

// City input field
const inputArea = document.getElementById("inputField");

// Search button
const searchBtn = document.getElementById("searchBtn");

// Current location button
const currentLocationBtn = document.getElementById("currentLocationButton");

// Dropdown section
const cityDropdownSection = document.getElementById("cityDropdownSection");

// Dropdown menu
const cityDropdownMenu = document.getElementById("cityDropdown");

// Error message text
const errMsg = document.getElementById("errorMsg");

// Extreme weather alert
const extAlert = document.getElementById("extWeather");

// WEATHER DETAILS

// City name
const cityName = document.getElementById("cityName");

// City temperature
const cityTemp = document.getElementById("cityTemp");

// Weather condition
const weatherCondition = document.getElementById("weatherCondition");

// Unit toggle button
const unitToggle = document.getElementById("unitToggle");

// Humidity value
const cityHumid = document.getElementById("humidity");

// Wind speed value
const cityWind = document.getElementById("windSpeed");

// FORECAST

// All forecast cards
const forecastCards = document.querySelectorAll(".forecastCard");

//
// Track temperature unit
let isCelsius = true;

// Store current temperature
let currentTemp = null;

// FETCH WEATHER

// Fetch current weather + 5 day forecast
async function getWeather(query) {
  const response = await fetch(
    `${baseUrl}/forecast.json?key=${apiKey}&q=${query}&days=5`
  ); // API call
  if (!response.ok) throw new Error("Fetch failed"); // Validate response
  return await response.json(); // Convert to JSON
}

// UI UPDATE

// Update current weather UI
function updateUI(data) {
  currentTemp = Math.round(data.current.temp_c); // Store temperature
  cityTemp.textContent = `${currentTemp}°`; // Show temperature in main card
  cityName.textContent = data.location.name; // Show city name
  weatherCondition.textContent = data.current.condition.text; // Show condition in main card
  const conditionText = data.current.condition.text; // Get condition text
  weatherCondition.textContent = conditionText; // Show condition text
  cityHumid.textContent = `${data.current.humidity}%`; // Show humidity
  cityWind.textContent = `${data.current.wind_kph} km/h`; // Show wind speed
  isCelsius = true; // Reset unit
  checkExtremeTemp(currentTemp); // Check extreme alert
  updateForecast(data.forecast.forecastday); // Update forecast
  updateWeatherVisuals(conditionText); // Update icons & background
}

// Update forecast cards
function updateForecast(days) {
  forecastCards.forEach((card, index) => {
    const day = days[index]; // Match card with forecast day
    if (!day) return;

    card.children[0].textContent = day.date; // Date
    card.children[1].textContent = `${Math.round(day.day.avgtemp_c)}°`; // Temperature
    card.children[3].textContent = `💨 ${day.day.maxwind_kph} km/h`; // Wind
    card.children[4].textContent = `💧 ${day.day.avghumidity}%`; // Humidity
  });
}

//For the background Visuals
function updateWeatherVisuals(condition) {
  body.classList.remove("bg-rainy", "bg-clear", "bg-cloudy"); // Reset backgrounds

  const text = condition.toLowerCase(); // Normalize text

  if (text.includes("rain")) {
    body.classList.add("bg-rainy"); // Rainy background
    weatherCondition.textContent = "🌧️ " + condition; // Rain icon
  } else if (text.includes("cloud")) {
    body.classList.add("bg-cloudy"); // Cloudy background
    weatherCondition.textContent = "☁️ " + condition; // Cloud icon
  } else if (text.includes("sun") || text.includes("clear")) {
    body.classList.add("bg-clear"); // Clear background
    weatherCondition.textContent = "☀️ " + condition; // Sun icon
  } else {
    weatherCondition.textContent = "🌡️ " + condition; // Default icon
  }
}

//
// Show error message
function showError(message) {
  errMsg.textContent = message; // Set error text
  errMsg.parentElement.classList.remove("hidden"); // Show error
}

// Hide error message
function hideError() {
  errMsg.parentElement.classList.add("hidden"); // Hide error
}

// Show alert if temperature is extreme
function checkExtremeTemp(temp) {
  if (temp >= 40) {
    extAlert.parentElement.classList.remove("hidden"); // Show alert
  } else {
    extAlert.parentElement.classList.add("hidden"); // Hide alert
  }
}

// Save searched city
function saveCity(city) {
  let cities = JSON.parse(localStorage.getItem("cities")) || []; // Get saved cities
  if (!cities.includes(city)) cities.unshift(city); // Avoid duplicates
  localStorage.setItem("cities", JSON.stringify(cities.slice(0, 5))); // Save max 5
  updateDropdown(); // Refresh dropdown
}

// Update dropdown UI
function updateDropdown() {
  const cities = JSON.parse(localStorage.getItem("cities")) || []; // Get cities
  cityDropdownMenu.innerHTML =
    "<option>Select a recently searched city</option>"; // Reset dropdown

  cities.forEach((city) => {
    const option = document.createElement("option"); // Create option
    option.textContent = city; // Set city name
    cityDropdownMenu.appendChild(option); // Add option
  });

  cityDropdownSection.classList.toggle("hidden", cities.length === 0); // Toggle dropdown
}

// Event Listener for when the search button is clicked
searchBtn.addEventListener("click", async () => {
  const city = inputArea.value.trim(); // Get input
  hideError(); // Hide old error

  if (!city) {
    showError("Please enter a city name"); // Validate input
    return;
  }

  try {
    const data = await getWeather(city); // Fetch data
    updateUI(data); // Update UI
    saveCity(city); // Save city
  } catch {
    showError("Invalid city name. Please try again."); // Show error
  }
});

// EEvent listener for when the current location button is clicked
currentLocationBtn.addEventListener("click", () => {
  hideError(); // Hide error section
  //navigator is a browser object
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords; // Get coordinates
      const data = await getWeather(`${latitude},${longitude}`); //example:  "q=43.2345345,25.6534534"
      updateUI(data); // Update UI
    },
    () => showError("Location access denied") // Handle error
  );
});

// Dropdown change
cityDropdownMenu.addEventListener("change", async (e) => {
  const city = e.target.value; // Get selected city
  if (city.includes("Select")) return; // Ignore default option

  hideError(); // Hide error message section
  const data = await getWeather(city); // Fetch data
  updateUI(data); // Update UI
});

//
// Toggle Celsius and Faranhiet units
unitToggle.addEventListener("click", () => {
  if (currentTemp === null) return; // When nothing is there, nothing will happen, pretty obvious but still writing it

  if (isCelsius) {
    cityTemp.textContent = `${Math.round((currentTemp * 9) / 5 + 32)}°`; // To °F
  } else {
    cityTemp.textContent = `${currentTemp}°`; // To °C
  }

  isCelsius = !isCelsius; // Toggle state (temperature units)
});

// Populate dropdown on page load
updateDropdown(); // Load saved cities when page is refreshed
