import { useState } from "react";
import CountryInfo from "./components/CountryInfo";
import ThemeToggle from "./components/ThemeToggle";
import LanguageSelector from "./components/LanguageSelector";
import "./styles.css"; // Animation styles here

const API_KEY = "fa6c87dbf0decad890ab1f635e202fe9"; // Replace with your API key

function App() {
  const [destination, setDestination] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [lang, setLang] = useState("en");
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setWeatherData(null);

    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }

    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${destination.trim()}&appid=${API_KEY}&units=metric`
      );

      if (!res.ok) {
        throw new Error("City not found");
      }

      const data = await res.json();
      setWeatherData(data);
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError(err.message || "Failed to fetch weather data.");
    }
  };

  return (
    <div className="city-night-wrapper">
      {/* Animated background */}
      <div className="city-sky"></div>
      <div className="city-buildings"></div>

      {/* Main App Content */}
      <div className="content-container">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 bg-opacity-80 backdrop-blur-md rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold">🌏 WanderLog</h1>
          <div className="flex gap-4">
            <LanguageSelector lang={lang} setLang={setLang} />
            <ThemeToggle />
          </div>
        </header>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 my-8 bg-opacity-80 backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-4">
            🌍 WanderLog
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
            Your smart travel planner with weather and currency insights.
          </p>

          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination (e.g., Tokyo)"
              className="flex-1 border rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:border-gray-600"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold"
            >
              Search
            </button>
          </form>

          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          {weatherData && (
            <div className="text-center bg-blue-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="text-2xl font-bold mb-2">
                {weatherData.name}, {weatherData.sys.country}
              </h3>
              <p className="text-lg">
                🌡️ {weatherData.main.temp}°C, {weatherData.weather[0].main}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
                Humidity: {weatherData.main.humidity}% | Wind:{" "}
                {weatherData.wind.speed} m/s
              </p>
            </div>
          )}
        </div>

        {/* Country/Place Info */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-10 bg-opacity-80 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-center text-purple-700 dark:text-purple-400 mb-4">
            🧭 Explore Location Info
          </h2>
          {destination.trim() !== "" ? (
            <CountryInfo countryCode={destination.trim()} lang={lang} />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400">
              Search a city or place to see info
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
