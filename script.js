//API Keys config
const apiKey = "2877ccd13e4143a8bb931919260601";
const baseUrl = "http://api.weatherapi.com/v1";

//Input area and search buttons
const inputArea = document.getElementById("inputField");
const searchBtn = document.getElementById("searchBtn");
const currentLocation = document.getElementById("currentLocationButton");

//City Dropdown section and menu
const cityDropdownSection = document.getElementById("cityDropdownSection");
const cityDropdownMenu = document.getElementById("cityDropdown");

//Error Message
const errMsg = document.getElementById("errorMsg");

//Extreme Weather Alert
const extAlert = document.getElementById("extWeather");

//City Details
//name of city
const cityName = document.getElementById("cityName");
//city temperature
const cityTemp = document.getElementById("cityTemp");
//weather condition of the city
const weatherCondition = document.getElementById("weatherCondition");
//Area for toggling celsius and faranhiet
const unitToggle = document.getElementById("unitToggle");
//State
let isCelsius = true;
//Humidity
const cityHumid = document.getElementById("humidity");
//Wind Speed
const cityWind = document.getElementById("windSpeed");

//5-day Forecast Cards
const forecastCard = document.querySelectorAll("forecastCard");

//Get the forecast from City Name
async function getWeatherbyCity(city) {
  //API calling
  console.log("Calling API");
  const response = await fetch(`${baseUrl}?key=${apiKey}&q=${city}`);
  //In case of an invalid response/ invalid input
  if (!response) {
    console.log("Enter valid City name");
  }
  //Returning fetched object in json format
  return await response.json();
}
//Update the UI after details are fetched
function updateUI(data) {
  cityName.textContent = data.current.name;
  console.log("In the Update UI");
}
//Event listener for search button
searchBtn.addEventListener("click", async () => {
  //cityName contains the text entered in the input area
  console.log("Search btn clicked!");
  const cityName = inputArea.value.trim();
  if (!city) {
    console.log("Enter valid City Name");
  }
  try {
    //Calls the getWeatherbyCity function, sends city name as parameter
    const weatherDetails = await getWeatherbyCity(cityName);
    updateUI(weatherDetails);
  } catch {
    console.log("Enter valid City Name");
  }
});
