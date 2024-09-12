import './App.css';
import { GoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import React, { useState } from "react";

function App() {
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [signedIn, setSignedIn] = useState(false);

  const responseGoogle = (response) => {
    console.log(response);
    const { code } = response;
    
    axios
      .post('/api/create-tokens', { code })
      .then(response => {
        console.log(response.data);
        setSignedIn(true);
      })
      .catch(error => console.log(error.message));
  };

  const responseError = (error) => {
    console.log(error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(summary, description, location, startDateTime, endDateTime);
    
    axios.post('/api/create-event', {
      summary,
      description,
      location,
      startDateTime,
      endDateTime,
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => console.log(error.message));
  };

  return (
    <div className="App">
      <h1>Google Calendar</h1>
      {!signedIn ? (
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={responseError}
          responseType="code"
          accessType="offline"
          scope="openid email profile https://www.googleapis.com/auth/calendar"
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <label htmlFor="summary">Summary</label>
          <input
            type="text"
            id="summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={e => setLocation(e.target.value)}
          />
          <label htmlFor="startDateTime">Start DateTime</label>
          <input
            type="datetime-local"
            id="startDateTime"
            value={startDateTime}
            onChange={e => setStartDateTime(e.target.value)}
          />
          <label htmlFor="endDateTime">End DateTime</label>
          <input
            type="datetime-local"
            id="endDateTime"
            value={endDateTime}
            onChange={e => setEndDateTime(e.target.value)}
          />
          <button type="submit">Create Event</button>
        </form>
      )}
    </div>
  );
}

export default App;
