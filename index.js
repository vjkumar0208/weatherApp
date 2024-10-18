const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");
const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-access");
const searchForm=document.querySelector("[data-searchForm]");
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");
const errorMessage = document.querySelector("[data-errorMessage]");

let currentTab=userTab;     //by default currentTab=userTab
let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");    //currentTab me css properties
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");     //old tab me se css hatayi
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");        //current tab me css lagayi
        if(!searchForm.classList.contains("active")){       //agar search tab active(visible) nhi hai to usse active(visible) karo
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //pehle search wale tab par tha ,ab your weather wale tab par hai
            userInfoContainer.classList.remove("active");
            searchForm.classList.remove("active");
            //getting coordinates(ab hum "your weather"  me aa gye hai to weather show karne ke liye coodinates access karne padenge)
            getfromSessionStorage();
        }
    }
}
userTab.addEventListener("click",()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
});

//check if coordinates are already present in session storage or not 
function getfromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){// agar coordinates saved nhi hai matlab location access mangega
        grantAccessContainer.classList.add("active");
    }
    else{       //coordinates ko json me convert karke pass kardia api calling fn
        const coordinates=JSON.parse(localCoordinates);     
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat,lon}=coordinates;
    //make grantcontainer invisible
    grantAccessContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");
    
    //api call
    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data=await response.json();

        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);  //it is the fn which seek weatherInfo and changes the "your weather" info wrt lon and lat
    }
    catch(err){
        loadingScreen.classList.remove("active");
        //jgfkjsgsagjas;lgjasjgg;jgg
    }

}
function renderWeatherInfo(weatherInfo){
    //saari weather info fetch karli
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windSpeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //fetching values from  weather info and put it in UI elements
    //here innertext is used to show in UI
    //? means if it is exists then show it otherwise undefined
    cityName.innerText=weatherInfo?.name;
    countryIcon.src=`https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText=weatherInfo?.weather?.[0]?.description;
    weatherIcon.src=`http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText=`${weatherInfo?.main?.temp}°C`;
    windspeed.innerText=`${weatherInfo?.wind?.speed}m/s`;
    humidity.innerText=`${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText=`${weatherInfo?.clouds?.all}%`;
}

function getLocation(){         //get current location
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //show an alert for no gelolocation support available
    }
}
function showPosition(position){
    const userCoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(userCoordinates));  //coordinates session storage me store kar diye
    fetchUserWeatherInfo(userCoordinates);      //fetch and show karega weather at this location
}

const grantAccessBtn=document.querySelector("[data-grantAccess]");
grantAccessBtn.addEventListener("click",getLocation);  //grantAccessBtn ko click karne par location mil jaye user ki

let searchInput=document.querySelector("[data-searchInput]")
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();     //default input remove
    let cityname=searchInput.value;
    if(cityname==="") return ;
    else  fetchSearchWeatherInfo(cityname);
})

async function fetchSearchWeatherInfo(city) {    
    // Hide the error message initially
    errorMessage.classList.remove("active");
    
    // Show the loading screen while fetching data
    loadingScreen.classList.add("active");
    grantAccessContainer.classList.remove("active");
    userInfoContainer.classList.remove("active");

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        const data = await response.json();

        if (response.status === 404 || data.cod === "404") {
            // If the city is not found, show the error message
            loadingScreen.classList.remove("active");
            errorMessage.classList.add("active");
        } else {
            // If the city is found, display the weather info
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
        }
    } catch (err) {
        // Handle any network or other errors
        loadingScreen.classList.remove("active");
        errorMessage.classList.add("active");
    }
}
