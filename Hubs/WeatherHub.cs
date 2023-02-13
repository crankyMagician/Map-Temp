using OpenMeteo;
using Microsoft.AspNetCore.SignalR;

namespace MGRS.Hubs
{
    public class WeatherHub :Hub
    {
       

        public async Task UpdateWeatherData(float lat, float lon)
        {
            //var weatherData = await _weatherDataService.GetWeatherDataAsync(lat, lon);

            //await Clients.All.SendAsync("ReceiveWeatherData", weatherData);
            // Before using the library you have to create a new client. Once created you can reuse it for every other api call you are going to make. 
            // There is no need to create multiple clients.
            OpenMeteo.OpenMeteoClient client = new OpenMeteo.OpenMeteoClient();

            // Set custom options
            WeatherForecastOptions options = new WeatherForecastOptions();
            options.Temperature_Unit = TemperatureUnitType.fahrenheit;
            options.Latitude = lat;
            options.Longitude = lon; // For Tokyo

            // Make a new api call to get the current weather in tokyo
            WeatherForecast? weatherData = await client.QueryAsync(options);

            if (weatherData != null)
            {
                await Clients.All.SendAsync("ReceiveWeatherData", weatherData.CurrentWeather.Temperature);

                // Output the current weather to console
                Console.WriteLine($"Weather in:longitude: {lon}, lattitude: {lat}  {weatherData.CurrentWeather.Temperature}  °F");
            }
           

          
        }
    }

}
