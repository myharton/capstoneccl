import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import "./Landing.css";

const Landing = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: () => {
      navigate("/main");
    },
    onError: () => {
      console.error("Login Failed");
    },
    flow: "auth-code",
  });

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1>Welcome to Forcast</h1>
        <p>Organize your day and stay updated with the latest weather forecasts.</p>
        <button onClick={() => login()} className="google-login-button">
          Sign in with Google 🚀
        </button>
      </header>

      <section className="features-section">
        <div className="feature">
          <h2>📅 Google Calendar Integration</h2>
          <p>Easily create and manage your events with the power of Google Calendar.</p>
        </div>

        <div className="feature">
          <h2>🌤️ Weather Forecast</h2>
          <p>Search for any city and get a 5-day weather forecast to plan your events accordingly.</p>
        </div>

        <div className="feature">
          <h2>🗺️ Interactive Weather Map</h2>
          <p>View real-time weather conditions and forecasts on an interactive map.</p>
        </div>

        <div className="feature">
          <h2>📰 Weather-Related News</h2>
          <p>Stay informed with the latest news related to weather and climate.</p>
        </div>
      </section>

      <footer className="landing-footer">
        <p>&copy; 2024 Calendar & Weather App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
