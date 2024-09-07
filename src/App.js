import React, { useState } from 'react';
import GoogleLogin from 'react-google-login';
import axios from 'axios';
import './App.css';

function App() {
  // State for form inputs
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [signedIn, setSignedIn] = useState(false);

  // Handle successful login
  const responseGoogle = (response) => {
    console.log('Login Successful:', response);
    const { tokenId } = response; // Google provides tokenId in response
    axios
    .post('/api/create-tokens', { token: tokenId })
     
  };

  // Handle login errors
  const responseError = (error) => {
    console.log('Login Error:', error);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can handle form submission, e.g., send data to backend
    //console.log(summary, description, location, startDateTime, endDateTime);
  axios.post('/api/create-event',{
    summary, 
    description, 
    location, 
    startDateTime, 
    endDateTime,
  })
  .then(response => {
    console.log('Token Response:', response.data);
    // Update signIn state
    setSignedIn(true);
  })
  .catch(error => console.log('Error:', error.message));
  };

  return (
    <div className="App">
      <h1>Calendar</h1>
      {!signedIn ? (
        <GoogleLogin
          clientId="1088234797181-l4aalmn8bdt4nhb302ktqrbmk6ak1pcg.apps.googleusercontent.com"
          buttonText="Sign in & Authorize Calendar"
          onSuccess={responseGoogle}
          onFailure={responseError}
          cookiePolicy={'single_host_origin'}
          scope='openid email profile https://www.googleapis.com/auth/calendar'
        />
      ) : (
        <div>
          <form onSubmit={handleSubmit}> 
            <label htmlFor="summary">Summary</label>
            <br />
            <input
              type="text"
              id="summary"
              value={summary}
              onChange={e => setSummary(e.target.value)}
            />
            <br />
            <label htmlFor="description">Description</label>
            <br />
            <textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
            <br />
            <label htmlFor="location">Location</label>
            <br />
            <input
              type="text"
              id="location"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
            <br />
            <label htmlFor="startDateTime">Start DateTime</label>
            <br />
            <input
              type="datetime-local"
              id="startDateTime"
              value={startDateTime}
              onChange={e => setStartDateTime(e.target.value)}
            />
            <br />
            <label htmlFor="endDateTime">End DateTime</label>
            <br />
            <input
              type="datetime-local"
              id="endDateTime"
              value={endDateTime}
              onChange={e => setEndDateTime(e.target.value)}
            />
            <br />
            <button type="submit">Create Event</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
