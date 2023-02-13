//using MGRS.Services;
using Microsoft.Extensions.Configuration;
using MGRS.Hubs;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();


// Add service for weather
//builder.Services.AddTransient<IWeatherDataService, WeatherDataService>();

// Add HttpClient as a singleton service
builder.Services.AddSingleton(sp => new HttpClient());
//signal R 
builder.Services.AddSignalR();


var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapHub<WeatherHub>("/weatherhub");
app.Run();
