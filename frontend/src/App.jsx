// src/App.js
import React, { useState } from 'react';
import Game from './Game';
import Register from './Register';
import Login from './Login';
import './App.css';

function App() {
  const [user, setUser] = useState(null); // State to hold the logged-in user

  return (
    <div className="App">
      {/* If the user is not logged in, show Register and Login components */}
      {!user ? (
        <>
          <Register />
          <Login setUser={setUser} />
        </>
      ) : (
        // Show the Game component if the user is logged in
        <Game user={user} />
      )}
    </div>
  );
}

export default App;
