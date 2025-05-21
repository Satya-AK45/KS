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
    className={`ml-2 px-6 py-2 rounded-md text-white font-medium shadow transition duration-300 ease-in-out transform ${
      disabled || isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
    }`}
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
      const transformed: WeatherData = {
        name: data.location?.name || "Unknown City",
        sys: { country: data.location?.country || "Unknown Country" },
        weather: [
          {
            description: data.current?.condition?.text || "",
            icon: data.current?.condition?.icon
              ? data.current.condition.icon
                  .replace("//cdn.weatherapi.com/weather/64x64/", "")
                  .replace(".png", "")
              : "",
          },
        ],
        main: {
          temp: data.current?.temp_c ?? 0,
          feels_like: data.current?.feelslike_c ?? 0,
          temp_min: data.current?.temp_c ?? 0,
          temp_max: data.current?.temp_c ?? 0,
          humidity: data.current?.humidity ?? 0,
        },
        wind: {
          speed: data.current?.wind_kph ? data.current.wind_kph / 3.6 : 0,
        },
      };
      setWeather(transformed);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Error fetching data");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  return (
    <div className="p-8 max-w-md mx-auto font-sans border border-gray-200 rounded-xl shadow-lg bg-gradient-to-br from-white to-blue-50 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">🌤️ Weather Forecast</h2>

      <div className="flex items-center">
        <input
          type="text"
          aria-label="City name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchWeather(city);
          }}
          className="flex-grow px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <Button onClick={() => fetchWeather(city)} isLoading={loading}>
          Search
        </Button>
      </div>

      {error && <p className="text-red-600 mt-4 font-medium">⚠️ {error}</p>}

      {weather && !loading && (
        <div className="mt-6 space-y-3 text-gray-800">
          <h3 className="text-xl font-semibold text-blue-800">
            {weather.name}, {weather.sys?.country}
          </h3>

          {weather.weather?.[0] && (
            <p className="flex items-center gap-2">
              <span>Condition: {weather.weather[0].description}</span>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="inline-block w-8 h-8"
              />
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <p>🌡️ Temperature: <strong>{weather.main.temp} °C</strong></p>
            <p>🤗 Feels Like: <strong>{weather.main.feels_like} °C</strong></p>
            <p>🔻 Min Temp: <strong>{weather.main.temp_min} °C</strong></p>
            <p>🔺 Max Temp: <strong>{weather.main.temp_max} °C</strong></p>
            <p>💧 Humidity: <strong>{weather.main.humidity} %</strong></p>
            <p>💨 Wind Speed: <strong>{weather.wind.speed.toFixed(2)} m/s</strong></p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherForecast;
