"use strict";
//start the hub connection
let connection = new signalR.HubConnectionBuilder().withUrl("/weatherhub").build();

//start the map (at roughly KC)
let map = L.map('map').setView([39.09464, -94.565198], 13);

// Add a tile layer to the map using OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    // Add attribution for OpenStreetMap
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);




// Start the SignalR connection
connection.start()
    .then(function () {
        // If the connection starts successfully, log a message to the console
        console.log("SignalR connection started");
    })
    .catch(function (err) {
        // If there was an error starting the connection, log the error to the console
        return console.error(err.toString());
    });

// Function that updates the weather data
function updateWeatherData(lat, lon) {
    // Invoke the UpdateWeatherData method on the server and pass in the latitude and longitude
    connection.invoke("UpdateWeatherData", lat, lon)
        .catch(function (err) {
            // If there was an error, log it to the console
            return console.error(err.toString());
        });
}



let popup = L.popup();
// Function that is called when a user clicks on the map
function onMapClickPopup(e) {
    // Call the updateWeatherData function and pass in the latitude and longitude of the click location
    updateWeatherData(e.latlng.lat, e.latlng.lng);

    // Listen for the ReceiveWeatherData event from the server
    connection.on("ReceiveWeatherData", function (weatherData) {
        console.log(weatherData); // Log the received weather data to the console

        // Update the popup content with the weather data
        popup
            .setLatLng(e.latlng) // Set the popup location to the location of the click
            .setContent("Temperature: " + weatherData.toString() + "°F<br>") // Set the popup content to include the temperature
            .openOn(map); // Open the popup on the map
    });
}


map.on('click', onMapClickPopup);