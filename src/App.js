import React,{useEffect, useState} from 'react';
import GoogleLogin from 'react-google-login';
import {gapi} from 'gapi-script';
import './App.css';


function App() {

  const [loginData, setLoginData] = useState(
    localStorage.getItem('loginData')? JSON.parse(localStorage.getItem('loginData')):null
  );

  const handleFailure = (result) => {
    console.log('result', result);
  };

  const handleLogin = async (googleData) => {
    const res = await fetch('/api/google-login', {
      method: 'POST',
      body: JSON.stringify({
        token: googleData.tokenId
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await res.json();

    setLoginData(data);

    localStorage.setItem('loginData', JSON.stringify(data))

  };

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: '',
      });
    }

    gapi.load('client:auth2', start);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loginData');
    setLoginData(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        {
          loginData?<><h3>you logged in as {loginData.email}</h3>
          <h3>Name: {loginData.name}</h3>
          <h3>Picture: <img src={loginData.picture} /></h3>
          <button onClick={handleLogout}>Logout</button>
          </>: <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
          buttonText='LOGIN WITH GOOGLE'
          onSuccess={handleLogin}
          onFailure={handleFailure}
          cookiePolicy='single_host_origin'
        ></GoogleLogin>
        }
       
      </header>
    </div>
  );
}

export default App;
