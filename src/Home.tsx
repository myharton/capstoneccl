import React from 'react';
import { GoogleLogin } from 'react-google-login';

const Home: React.FC = () => {
  // Handle successful login
  const responseGoogle = (response: any) => {
    console.log('Login Successful', response);
  };

  // Handle login errors
  const handleLoginError = (error: any) => {
    console.log('Login Error', error);
  };

  return (
    <div className="home">
      <h1>Welcome</h1>
      <GoogleLogin
        clientId="1088234797181-l4aalmn8bdt4nhb302ktqrbmk6ak1pcg.apps.googleusercontent.com" // Replace with your actual client ID
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={handleLoginError}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Home;
