var APIKey = "16202c6e80fee5da38da3ef00e9cdf59";
//var cityName = prompt("Enter city");
var cityName;

var lat;
var lon;

// function initializeLocalStorage(){
//     // localStorage.removeItem("dataKey");
//     if(!("weatherDataKey" in localStorage))
//     { 
//         var plannerData = [{time : "9AM", currentPlan: ""},{time : "10AM", currentPlan: ""},{time : "11AM", currentPlan: ""},{time : "12PM", currentPlan: ""},{time : "1PM", currentPlan: ""},{time : "2PM", currentPlan: ""},{time : "3PM", currentPlan: ""},{time : "4PM", currentPlan: ""},{time : "5PM", currentPlan: ""}];

//         localStorage.setItem("plannerDataKey", JSON.stringify(plannerData));
//     }
// }

$(".btn").on("click" , function(event){
    event.preventDefault();
    
    cityName = $(".form-control").val();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + ",Burundi&appid=" + APIKey;

$.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
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
        console.log(response);
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

        console.log(response.list.length);

        var j=1;
        for(i=3; i<response.list.length;i+=8)
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
})




