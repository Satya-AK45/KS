import React, { useState, useEffect } from "react";
import { getCurrentWeather } from "../../services/weatherService";

interface WeatherData {
  name: string;
  sys: { country: string };
  weather: { description: string; icon: string }[];
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: { speed: number };
}

const Button: React.FC<{
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ onClick, isLoading, disabled, children }) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    style={{
      marginLeft: 8,
      padding: "8px 12px",
      fontSize: 16,
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.6 : 1,
    }}
  >
    {isLoading ? "Loading..." : children}
  </button>
);

const WeatherForecast: React.FC = () => {
  const [city, setCity] = useState("Pune");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (cityName: string) => {
    if (!cityName.trim()) {
      setError("Please enter a city name");
      setWeather(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentWeather(cityName);
      setWeather(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error fetching data");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch default city weather on mount
    fetchWeather(city);
  }, []);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        maxWidth: 400,
        margin: "auto",
        border: "1px solid #ddd",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>Weather Forecast</h2>
      <input
        aria-label="City name"
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        style={{
          padding: 8,
          width: "70%",
          fontSize: 16,
          borderRadius: 4,
          border: "1px solid #ccc",
          outline: "none",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            fetchWeather(city);
          }
        }}
      />
      <Button onClick={() => fetchWeather(city)} isLoading={loading}>
        Search
      </Button>

      {error && <p style={{ color: "red", marginTop: 12 }}>Error: {error}</p>}

      {weather && !loading && (
        <div style={{ marginTop: 20 }}>
          <h3>
            {weather.name}, {'India'}
          </h3>
          <p>
            Condition: {weather.weather[0].description}{" "}
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
              style={{ verticalAlign: "middle" }}
            />
          </p>
          <p>Temperature: {weather.main.temp} °C</p>
          <p>Feels Like: {weather.main.feels_like} °C</p>
          <p>Min Temp: {weather.main.temp_min} °C</p>
          <p>Max Temp: {weather.main.temp_max} °C</p>
          <p>Humidity: {weather.main.humidity} %</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
