console.log("hello world");
const API_key="d1845658f92b31c64bd94f06f7188c9c";
async function fetchWeather(){
    try{
        let city="delhi";
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);

        const data=await response.json();
        console.log("weather data:->",data);

        let newPara=document.createElement('p');
        newPara.textContent=`${data?.main?.temp.toFixed(2)} ~C`;
        document.body.appendChild(newPara);
    }
    catch(err){
        //handle the error
        console.log("errror aa gya bhai",err);
    }
}
async function fetchWeatherBy_Long_Lat() {
    try{
        let lat=17.633;
        let lon=18.333;
        const result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        let data=result.json();
        console.log(data);
    }
    catch(err){
        //handle the error
        console.log("errror aa gya bhai",err);
    }
}