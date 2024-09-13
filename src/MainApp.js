import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MainApp.css"; // Ensure your styles are included
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { MapContainer, TileLayer } from "react-leaflet"; // Import Leaflet components
import "leaflet/dist/leaflet.css"; // Import Leaflet styles

const API_KEY_WEATHER = "bf178857c63ce9791831ddfc884013e3"; // Replace with your OpenWeatherMap API key
const API_KEY_NEWS = "54f7002036574767a5534c2b6cab3c08"; // Replace with your NewsAPI key

function MainApp() {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [signedIn, setSignedIn] = useState(false);
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [newsData, setNewsData] = useState([]); // Keep the news state
  const [error, setError] = useState(null);
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  const accessToken = ""; // Set your access token

  const fetchCalendars = async () => {
    try {
      const response = await axios.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setCalendars(response.data.items);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };

  const handleCalendarSelection = (e) => {
    const selected = Array.from(e.target.selectedOptions, (option) => option.value);
    setSelectedCalendars(selected);
  };

  // Fetch weather-related news
  const fetchNews = async () => {
    try {
      const response = await axios.get(`https://newsapi.org/v2/everything?q=weather&apiKey=${API_KEY_NEWS}`);
      setNewsData(response.data.articles); // Store the news articles in state
    } catch (err) {
      console.error("Failed to fetch news:", err);
    }
  };

  // Fetch weather data
  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY_WEATHER}&units=metric`
      );
      setWeatherData(response.data);
      setLat(response.data.coord.lat);
      setLon(response.data.coord.lon);
      setError(null);
      fetchNews(); // Fetch news when weather data is available
    } catch (err) {
      setError("City not found");
      setWeatherData(null);
      setNewsData([]); // Clear news data if weather data is not found
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    fetchWeather();
  };

  const responseGoogle = (response) => {
    console.log(response);
    const { code } = response;

    axios
      .post("http://localhost:4000/api/create-tokens", { code })
      .then((response) => {
        console.log(response.data);
        setSignedIn(true);
        fetchCalendars(); // Fetch calendars after sign-in
      })
      .catch((error) => console.log(error.message));
  };

  const responseError = (error) => {
    console.log(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/create-event", {
        summary,
        description,
        location,
        startDateTime,
        endDateTime,
        calendarId: selectedCalendars[0], // Example: using the first selected calendar
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => console.log(error.message));
  };

  const login = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseError,
    flow: "auth-code",
  });

  return (
    <div className="App">
      <h1>Google Calendar & Weather App</h1>

      {!signedIn ? (
        <button onClick={() => login()}>Sign in with Google 🚀</button>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <label htmlFor="summary">Summary</label>
            <input
              type="text"
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <label htmlFor="startDateTime">Start DateTime</label>
            <input
              type="datetime-local"
              id="startDateTime"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
            <label htmlFor="endDateTime">End DateTime</label>
            <input
              type="datetime-local"
              id="endDateTime"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
            <label htmlFor="calendar">Select Calendar</label>
            <select id="calendar" multiple onChange={handleCalendarSelection}>
              {calendars.map((calendar) => (
                <option key={calendar.id} value={calendar.id}>
                  {calendar.summary}
                </option>
              ))}
            </select>
            <button type="submit">Create Event</button>
          </form>
        </>
      )}

      <h2>Weather Forecast</h2>
      <form onSubmit={handleCitySearch}>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />
        <button type="submit">Search Weather</button>
      </form>

      {error && <p>{error}</p>}
      {weatherData && (
        <div>
          <h3>Weather in {weatherData.name}</h3>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
        </div>
      )}

      <h2>Weather Map</h2>
      <div style={{ height: "400px", width: "100%" }}>
        {lat && lon ? (
          <MapContainer center={[lat, lon]} zoom={10} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url={`http://maps.openweathermap.org/maps/2.0/radar/{z}/{x}/{y}?appid=${API_KEY_WEATHER}`}
              attribution="&copy; <a href='https://openweathermap.org/'>OpenWeatherMap</a>"
            />
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>

      <h2>Weather-Related News</h2>
      <div className="news-section">
        {newsData.length > 0 ? (
          newsData.slice(0, 5).map((article, index) => (
            <div key={index} className="news-article">
              <h3>{article.title}</h3>
              <p>{article.description}</p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))
        ) : (
          <p>No news available</p>
        )}
      </div>
    </div>
  );
}

export default MainApp;
