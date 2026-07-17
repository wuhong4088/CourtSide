import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GameFeed from './pages/GameFeed';
import CreateGame from './pages/CreateGame';
import MatchHistory from './pages/MatchHistory';
import CourtDirectory from './pages/CourtDirectory';
import GearChecklist from './pages/GearChecklist';

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('courtside_user') || '';
  });

  // Verify and sync session on mount
  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('No active session');
      })
      .then((data) => {
        setCurrentUser(data.username);
        localStorage.setItem('courtside_user', data.username);
      })
      .catch(() => {
        // Clear username if not logged in
        setCurrentUser('');
        localStorage.removeItem('courtside_user');
      });
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route
              path="/games"
              element={<GameFeed currentUser={currentUser} />}
            />
            <Route
              path="/create-game"
              element={<CreateGame currentUser={currentUser} />}
            />
            <Route
              path="/matches"
              element={<MatchHistory currentUser={currentUser} />}
            />
            <Route
              path="/courts"
              element={<CourtDirectory currentUser={currentUser} />}
            />
            <Route
              path="/checklists"
              element={<GearChecklist currentUser={currentUser} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
