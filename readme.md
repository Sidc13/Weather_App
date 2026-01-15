Dear reader,
This is a weather app made using HTML, tailwind CSS and javascript.
The purpose of this web application is for learning and applying the technologies/functionalities the developer has worked on so far, namely, writing markups and code.
The approach here is to create the html and javascript files, install tailwind css, and then get the structure ready.
Then the objective is to properly set up the UI, following which is to add functionality using fetch/async-await.

COMPLETE STEP-BY-STEP DEVELOPMENT MAP:

1. Create and push html boilerplate.
2. Create an empty javascipt file script.js and then push the file to git, github.
3. Set up an environment for Tailwind: Install tailwind CSS using the tailwind CLI tool (no custom PostCSS pipeline) then create an 'src' folder with 'index.html' 'input.css' and 'output.css'. Link the HTML file with 'output.css'.
4. Create a gitignore file to ignore files that are not needed, namely node modules, environment variables and so on.
5. Develop a simple UI for the weather app, there will be a search bar for naming the city the user wants. There will be a space/hero section where the current weather will be displayed. Below that we will have a 5-day forecast (smaller boxes showcasing the details). The same shall be optimized for different screen sizes: Desktop, iPad mini, iPhone SE.
6. Now in the javascript file, all the sections/paragraphs/buttons will have to be assigned a variable so that the UI can perform some tasks. IT is to be checked whether the city name entered in the input bar is recorded. This recorded name shall be used/sent and the UI will be updated. For now there is an event listener on the search button, once clicked the name is sent to the getWeatherbyCity() which calls the API, then the updateUI() is called which sets the innerText of each element as per the details fetched from the API. Errors are not handled at the moment, will be done once fetch works.
7. Now to develop it completely, we have event listeners for the buttons search(input area has city name) and current location. This event will call the function that will fetch data from the API. This data when recieved goes to saveCity and updateUI functions to update the UI. The saveCity parses the city name into the local storage so that the dropdown is present with the city names even after page reload.
8. To add the forecast, the functions for fetching data from the API were revised. Since getting a 5-day forecast would also include the current day's weather, the url was updated to fetch the forecast from which the current weather was extracted for the main weather card. The UI updation was revised as well for the 5 cards and an emoji with a background visual change was added in the main card.
9. Errors have been handled properly, variables havent been created unnecesarily, just enough for readability, comments have been noted down for references to the UI and this documentation is the actual coding journal of the developer.

It was a great journey to develop a simple web application. Thankyou for coming along!
