const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-cotainer");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");


const API_KEY = "17d0af5c4965c9cc04adeb9f66db9f89";
let oldTab = userTab;
oldTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(newTab){
    if(newTab !== oldTab){
        oldTab.classList.remove("current-tab");
        oldTab = newTab;
        oldTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){ // agar search form ke andar active nahi pada hua hai to lake aao
             userInfoContainer.classList.remove("active");
             grantAccessContainer.classList.remove("active");
             searchForm.classList.add("active");
        }
        else{
            // main pahele sraech wale tab par tha aab muze your current weather on karna hai
         searchForm.classList.remove("active");
         userInfoContainer.classList.remove("active");
        //main your weather me aa gaya hu to your current location weather ko display karna padega,
        //  so let's check on local storage first for coordinates present hai ki nahi
         getfromSessionStorage();
        }
    }
}

userTab.addEventListener("click",() => {
    // Passed Clicked Tab as a input Parameter
    switchTab(userTab);
});

searchTab.addEventListener("click",() => {
    // Passed Clicked Tab as a input Parameter
    switchTab(searchTab);
});


function getfromSessionStorage(){
    // check if coordinates are already presnt in local storage
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
       // agar local coordinates nahi mile yani save nahi ahi
       // to grant location visible karo aur location access karne lagao aur coordinates store karo
       grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat, lon} = coordinates; 
    // location access kar rahe oh to loader hatao aur grantlocation ko bhi hatao
    // make grantaccesscontainer invisible
    grantAccessContainer.classList.remove("active");

    //make loader visible
    loadingScreen.classList.add("active");

    // API Call

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
          
        //agar api se access aagayi to loader hata ke userinformation dikao
        loadingScreen.classList.remove("active");
        
        //user info dikhao
        userInfoContainer.classList.add("active");
        // ui pe dynamically values dikhao
        renderWeatherinfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active")
      // console.log('access denied')
    }

}

function renderWeatherinfo(weatherInfo){
    // firstly we have to fetch element
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windSpeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");


    // values from weatherinfo object and put in UI....
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;
    windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
   
}


function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No Geolocation Support");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit",(e) => {
e.preventDefault();
let cityName = searchInput.value;

if(cityName === ""){
    return;
}
else{
    fetchSearchWeatherInfo(cityName);
}
})

async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    const data = await response.json();

    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherinfo(data);

  }
  catch(err){
          
  }
}
