// ================= API CONFIG =================

// WeatherAPI key
const apiKey = "2877ccd13e4143a8bb931919260601";

// Base API URL
const baseUrl = "http://api.weatherapi.com/v1";

// ================= INPUTS & BUTTONS =================

// City input field
const inputArea = document.getElementById("inputField");

// Search button
const searchBtn = document.getElementById("searchBtn");

// Current location button
const currentLocationBtn = document.getElementById("currentLocationButton");

// ================= DROPDOWN =================

// Dropdown section
const cityDropdownSection = document.getElementById("cityDropdownSection");

// Dropdown menu
const cityDropdownMenu = document.getElementById("cityDropdown");

// ================= ERROR & ALERT =================

// Error message text
const errMsg = document.getElementById("errorMsg");

// Extreme weather alert
const extAlert = document.getElementById("extWeather");

// ================= WEATHER DETAILS =================

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

// ================= STATE =================

// Track temperature unit
let isCelsius = true;

// Store current temperature
let currentTemp = null;

// ================= FETCH WEATHER =================

// Fetch weather by city name
async function getWeatherByCity(city) {
  const response = await fetch(
    `${baseUrl}/current.json?key=${apiKey}&q=${city}`
  ); // API call
  if (!response.ok) throw new Error("Invalid city"); // Validate response
  return await response.json(); // Convert to JSON
}

// Fetch weather by coordinates
async function getWeatherByCoords(lat, lon) {
  const response = await fetch(
    `${baseUrl}/current.json?key=${apiKey}&q=${lat},${lon}`
  ); // API call
  if (!response.ok) throw new Error("Location error"); // Validate response
  return await response.json(); // Convert to JSON
}

// ================= UI UPDATE =================

// Update weather data on UI
function updateUI(data) {
  currentTemp = Math.round(data.current.temp_c); // Store temperature
  cityTemp.textContent = `${currentTemp}°`; // Show temperature
  cityName.textContent = data.location.name; // Show city name
  weatherCondition.textContent = data.current.condition.text; // Show condition
  cityHumid.textContent = `${data.current.humidity}%`; // Show humidity
  cityWind.textContent = `${data.current.wind_kph} km/h`; // Show wind speed
  isCelsius = true; // Reset temperature unit
  checkExtremeTemp(currentTemp); // Check extreme alert
}

// ================= ERROR HANDLING =================

// Show error message
function showError(message) {
  errMsg.textContent = message; // Set error text
  errMsg.parentElement.classList.remove("hidden"); // Show error section
}

// Hide error message
function hideError() {
  errMsg.parentElement.classList.add("hidden"); // Hide error section
}

// ================= EXTREME WEATHER =================

// Show alert if temperature is extreme
function checkExtremeTemp(temp) {
  if (temp >= 40) {
    extAlert.parentElement.classList.remove("hidden"); // Show alert
  } else {
    extAlert.parentElement.classList.add("hidden"); // Hide alert
  }
}

// ================= RECENT SEARCHES =================

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
    cityDropdownMenu.appendChild(option); // Add to dropdown
  });

  cityDropdownSection.classList.toggle("hidden", cities.length === 0); // Show/hide dropdown
}

// ================= EVENT LISTENERS =================

// Search button click
searchBtn.addEventListener("click", async () => {
  const city = inputArea.value.trim(); // Get input value
  hideError(); // Hide old error

  if (!city) {
    showError("Please enter a city name"); // Validate input
    return;
  }

  try {
    const data = await getWeatherByCity(city); // Fetch weather
    updateUI(data); // Update UI
    saveCity(city); // Save city
  } catch {
    showError("Invalid city name. Please try again."); // Show error
  }
});

// Current location button click
currentLocationBtn.addEventListener("click", () => {
  hideError(); // Hide error

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords; // Get coordinates
      const data = await getWeatherByCoords(latitude, longitude); // Fetch weather
      updateUI(data); // Update UI
    },
    () => showError("Location access denied") // Handle error
  );
});

// Dropdown change
cityDropdownMenu.addEventListener("change", async (e) => {
  const city = e.target.value; // Get selected city
  if (city.includes("Select")) return; // Ignore default option

  hideError(); // Hide error
  const data = await getWeatherByCity(city); // Fetch weather
  updateUI(data); // Update UI
});

// ================= TEMPERATURE TOGGLE =================

// Toggle °C / °F
unitToggle.addEventListener("click", () => {
  if (currentTemp === null) return; // Prevent toggle if no data

  if (isCelsius) {
    cityTemp.textContent = `${Math.round((currentTemp * 9) / 5 + 32)}°`; // Convert to Fahrenheit
  } else {
    cityTemp.textContent = `${currentTemp}°`; // Convert back to Celsius
  }

  isCelsius = !isCelsius; // Toggle state
});

// ================= INITIAL LOAD =================

// Populate dropdown on page load
updateDropdown(); // Load recent cities
