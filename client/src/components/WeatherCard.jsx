import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const WeatherCard = ({ destination }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!destination) return;
    const fetchWeather = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE}/api/travel/weather?location=${encodeURIComponent(destination)}`
        );
        setWeather(data.data);
      } catch {
        // silently hide if weather unavailable
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [destination]);

  if (loading) {
    return (
      <div className="weather-card weather-loading">
        <div className="weather-loading-dots">
          <span /><span /><span />
        </div>
        <span>Fetching live weather for {destination}…</span>
      </div>
    );
  }

  if (!weather) return null;

  const emoji = getWeatherEmoji(weather.desc);

  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-emoji">{emoji}</div>
        <div className="weather-info">
          <div className="weather-temp">{weather.tempC}°C</div>
          <div className="weather-desc">{weather.desc}</div>
          <div className="weather-location">📍 {destination} — Live Conditions</div>
        </div>
        <div className="weather-details">
          <div className="weather-detail">
            💧 <strong>{weather.humidity}%</strong> <span>Humidity</span>
          </div>
          <div className="weather-detail">
            💨 <strong>{weather.windspeedKmph} km/h</strong> <span>Wind</span>
          </div>
          <div className="weather-detail">
            🌡️ <strong>{weather.feelsLikeC}°C</strong> <span>Feels like</span>
          </div>
        </div>
      </div>

      {weather.forecast?.length > 0 && (
        <div className="weather-forecast">
          <div className="forecast-label">3-Day Forecast</div>
          <div className="forecast-grid">
            {weather.forecast.map((day, i) => (
              <div key={i} className="forecast-day">
                <div className="forecast-date">{formatDate(day.date)}</div>
                <div className="forecast-icon">{getWeatherEmoji(day.desc)}</div>
                <div className="forecast-desc">{day.desc}</div>
                <div className="forecast-temps">
                  <span className="temp-min">{day.minTempC}°</span>
                  <span className="temp-sep">–</span>
                  <span className="temp-max">{day.maxTempC}°C</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function getWeatherEmoji(desc) {
  if (!desc) return '🌤️';
  const d = desc.toLowerCase();
  if (d.includes('thunder') || d.includes('storm')) return '⛈️';
  if (d.includes('snow') || d.includes('blizzard') || d.includes('sleet')) return '❄️';
  if (d.includes('rain') || d.includes('shower') || d.includes('drizzle')) return '🌧️';
  if (d.includes('fog') || d.includes('mist') || d.includes('haze')) return '🌫️';
  if (d.includes('overcast')) return '☁️';
  if (d.includes('cloud') || d.includes('partly')) return '⛅';
  if (d.includes('sunny') || d.includes('clear')) return '☀️';
  return '🌤️';
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default WeatherCard;
