import axios from 'axios';

const API_KEY = '5fbcb5963213697972509db91e86cf80';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const getCurrentWeather = async (city: string) => {
  try {
    const response = await axios.get(WEATHER_API_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;

    // Normalize the structure to match internal expectations (like weatherData.current.temp_c)
    const normalizedWeather = {
      current: {
        temp_c: data.main.temp,
        humidity: data.main.humidity,
        wind_kph: data.wind.speed * 3.6, // m/s to kph
        precip_mm: data.rain?.['1h'] || 0,
        condition: data.weather[0]?.description || 'Unknown',
      },
      location: {
        name: data.name,
        country: data.sys.country,
        lat: data.coord.lat,
        lon: data.coord.lon,
      },
      raw: data, // Keep raw data if needed
    };

    return normalizedWeather;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};
