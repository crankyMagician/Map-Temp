"use strict";

let connection = new signalR.HubConnectionBuilder().withUrl("/weatherhub").build();

let map = L.map('map').setView([39.09464, -94.565198], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

/*
function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}
*/
//map.on('click', onMapClick);

connection.start().then(function () {
    console.log("SignalR connection started");
}).catch(function (err) {
    return console.error(err.toString());
});

function updateWeatherData(lat, lon) {
    connection.invoke("UpdateWeatherData", lat, lon).catch(function (err) {
        return console.error(err.toString());
    });
}

/*

connection.on("ReceiveWeatherData", function (weatherData) {
    console.log(weatherData);

    // Update the popup content with the weather data
    popup.setContent("Temperature: " + weatherData.temperature.toString() + "°F<br>");
});
*/



let popup = L.popup();

/*
function onMapClickPopup(e) {
  
    updateWeatherData(e.latlng.lat, e.latlng.lng);
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
*/

function onMapClickPopup(e) {
    updateWeatherData(e.latlng.lat, e.latlng.lng);

    connection.on("ReceiveWeatherData", function (weatherData) {
        console.log(weatherData);

        // Update the popup content with the weather data
        popup
            .setLatLng(e.latlng)
            .setContent("Temperature: " + weatherData.toString() + "°F<br>")
            .openOn(map);
    });
}

map.on('click', onMapClickPopup);