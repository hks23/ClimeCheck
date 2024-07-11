import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";


function Forcast(props) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const [airQuality, setAirQuality] = useState(null);

  const search = (city) => {
    axios
      .get(`${process.env.REACT_APP_WEATHER_API_URL}weather?q=${city !== "[object Object]" ? city : query}&units=metric&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`)
      .then((response) => {
        setWeather(response.data);
        setQuery("");
        // Fetch air quality data after fetching weather data
        const { lat, lon } = response.data.coord;

        return axios.get(
          `${process.env.REACT_APP_WEATHER_API_URL}air_pollution?lat=${lat}&lon=${lon}&APPID=${process.env.REACT_APP_WEATHER_API_KEY}`
        );
      })
      .then((response) => {
        setAirQuality(response.data.list[0].main.aqi);
      })
      .catch(function (error) {
        console.log(error);
        setWeather("");
        setQuery("");
        setError({ message: "Not Found", query: query });
      });
  };

  const defaults = {
    color: "white",
    size: 112,
    animate: true,
  };

  useEffect(() => {
    search("Mumbai");
  }, []);

  const getAirQualityDescription = (aqi) => {
    switch (aqi) {
      case 1:
        return "Good";
      case 2:
        return "Fair";
      case 3:
        return "Moderate";
      case 4:
        return "Poor";
      case 5:
        return "Very Poor";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="forecast">
      <div className="forecast-icon">
        <ReactAnimatedWeather
          icon={props.icon}
          color={defaults.color}
          size={defaults.size}
          animate={defaults.animate}
        />
      </div>
      <div className="today-weather">
        <h3>{props.weather}</h3>
        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search any city"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
          />
          <div className="img-box">
            <img
              src="https://images.avishkaar.cc/workflow/newhp/search-white.png"
              onClick={() => search(query)}
              alt="search"
            />
          </div>
        </div>
        <ul>
          {typeof weather.main !== "undefined" ? (
            <div>
              <li className="cityHead">
                <p>
                  {weather.name}, {weather.sys.country}
                </p>
                <img
                  className="temp"
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt="weather icon"
                />
              </li>
              <li>
                Temperature{" "}
                <span className="temp">
                  {Math.round(weather.main.temp)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Feels like{" "}
                <span className="temp">
                  {Math.round(weather.main.feels_like)}°c ({weather.weather[0].main})
                </span>
              </li>
              <li>
                Humidity{" "}
                <span className="temp">
                  {Math.round(weather.main.humidity)}%
                </span>
              </li>
              <li>
                Air Quality{" "}
                <span className="temp">{getAirQualityDescription(airQuality)}</span>
              </li>
              <li>
                Wind Speed{" "}
                <span className="temp">{Math.round(weather.wind.speed)} Km/h</span>
              </li>
            </div>
          ) : (
            <div>
              <p>{error.message}</p>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Forcast;