var APIKey = "16202c6e80fee5da38da3ef00e9cdf59";
//var cityName = prompt("Enter city");
var cityName;

var lat;
var lon;
onLoad();
function onLoad(){
    // navigator.geolocation.getCurrentPosition(showPosition);
    // function showPosition(position) {
    //     console.log(position.coords.latitude) + 
    //     console.log(position.coords.longitude);
    //   }
    renderLocationHistory();
    displayData();
}

console.log(window);
initializeLocalStorage();
//renderLocationHistory();

function renderLocationHistory(){
    locations = JSON.parse(localStorage.getItem("weatherDataKey"));

    for(let i = locations.length - 1 ; i>=0; i--)
    {
        $(`#listLocation${i}`).text(locations[i]);
    }

}

function updateLocalStorage(currCityName){
    locations = JSON.parse(localStorage.getItem("weatherDataKey"));

    for(let i=0; i<locations.length;i++)
    {
        //let newCity = $(".form-control").val();
        if(locations[i] === currCityName)
        {
            for(let j=i; j<locations.length - 1;j++)
            {
                locations[j] = locations[j+1];
            }
            locations[locations.length - 1] = currCityName;

            localStorage.setItem("weatherDataKey", JSON.stringify(locations));

            return;
        }
    }

    if(locations.length < 5)
    {  
        locations.push(currCityName);
    }
    else
    {
        locations.shift();
        locations.push(currCityName);
    }
    
    localStorage.setItem("weatherDataKey", JSON.stringify(locations));

    console.log(locations);

}

function initializeLocalStorage(){
    // localStorage.removeItem("weatherDataKey");
    if(!("weatherDataKey" in localStorage))
    { 
        
        var locations = [];
        localStorage.setItem("weatherDataKey", JSON.stringify(locations));
    }
}

$(".btn").on("click" , displayData);
$(".list-group-item").on("click" , displayData);

function displayData(){
    {
        
//////////////////////////////////////////

   console.log($(this).is("button"));
   console.log($(this).text());
   console.log($(this).is("li"));

   if($(this).is("button")) 
   {
    event.preventDefault();
    cityName = $(".form-control").val();
    updateLocalStorage(cityName);
    renderLocationHistory();
    
   }
   else if($(this).is("li"))
   {
    cityName = $(this).text();
    updateLocalStorage(cityName);
    renderLocationHistory();
   }
   else
   {
       cityName = $("#listLocation4").text();
   }


//////////////////////////////////////////
        //cityName = $(".form-control").val();
    
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",Burundi&appid=" + APIKey;
    
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        //console.log(response);
        //getting the current weather icon from the response data
        var iconcode = response.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
    
        $("#wicon").attr('src', iconurl);
        //setting the current temperature
        let tempInK = response.main.temp;
        let tempInF = (tempInK - 273.15) * 9/5 + 32;
        $("#currTemp").text(tempInF.toFixed(2));
    
        //setting the current humidity
        $("#currHumidity").text(response.main.humidity);
    
        //setting the wind speed
        $("#currWindSpeed").text(response.wind.speed);
    
        lat = response.coord.lat;
        lon = response.coord.lon;

        console.log(lat);
        console.log(lon);
    
        var timeStamp = response.dt;
        var date = new Date(timeStamp * 1000);
        var month = date.getMonth() + 1;
        var year = date.getFullYear();
    
        var dateStr = "(" + month + "/" + date.getDate() + "/" + year + ")";
    
        //$("#cityName").text(cityName + " " + dateStr);
        $("#cityName")[0].innerText = cityName + " " + dateStr;
        console.log($("#cityName")[0].innerText);
    
        getUVIndex();
        getForecast();
    
      });
    
      function getUVIndex(){
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon ,
            method: "GET"
          }).then(function(response) {
            //console.log(response);
            $("#currUVindex").text(response.value);
          });
      }
    
      function getForecast(){
          //var five = parseInt(5);
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon ,
            //url: "http://api.openweathermap.org/data/2.5/forecast/daily?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon + "&cnt=" + five ,
            method: "GET"
        }).then(function(response){
            console.log(response);
    
            //console.log(response.list.length);
    
            var j=1;
            for(let i=3; i<response.list.length;i+=8)
            {
                //Temperature
                let tempK = response.list[i].main.temp;
                let tempF = (tempK - 273.15) * 9/5 + 32;
                $(`#tempDay${j}`).text(tempF.toFixed(2));
    
                //Humidity
                $(`#humDay${j}`).text(response.list[i].main.humidity);
    
                //Date
                var timeStamp = response.list[i].dt;
                var date = new Date(timeStamp * 1000);
                var month = date.getMonth() + 1;
                var year = date.getFullYear();
    
                var dateStr = month + "/" + date.getDate() + "/" + year ;
    
                $(`#dateDay${j}`).text(dateStr);
    
                //Get icon
                var iconcode = response.list[i].weather[0].icon;
                var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
                $(`#wiconDay${j}`).attr('src', iconurl);
    
                j++;
            }
    
        });
        }
    }
}




