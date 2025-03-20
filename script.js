// const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
const API_KEY = "17d0af5c4965c9cc04adeb9f66db9f89";


function renderWeatherinfo(data) {
    let newpara = document.createElement('p');
    newpara.textContent = `${data?.main?.temp.toFixed(2)} °C`

    document.body.appendChild(newpara);
}


async function FetchweatherDetails() {
    try {
        let city = "goa";
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        console.log("weather data:->", data);

        renderWeatherinfo(data);
    }
    catch (err) {
        // handle on your own
        //   console .log("Error Occured", err);
    }
}


async function getCustomWeatherDetails() {
    try {
        let latitude = 15.6333;
        let longitude = 18.3333;

        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
        let data = await result.json();
        console.log(data);
        renderWeatherinfo(data);
    }
    catch (err) {
        console.log("Error Fouund", err);
    }

}




function switchTab(clickedTab) {

    apiErrorContainer.classList.remove("active");
  
    if (clickedTab !== currentTab) {
      currentTab.classList.remove("current-tab");
      currentTab = clickedTab;
      currentTab.classList.add("current-tab");
  
      if (!searchForm.classList.contains("active")) {
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
      } 
      else {
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        //getFromSessionStorage();
      }
  
      // console.log("Current Tab", currentTab);
    }
  }


  function GetLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        console.log("No Geolocation Support");
    }
}


function showPosition(position){
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;

    console.log(lat);
    console.log(lon);
}