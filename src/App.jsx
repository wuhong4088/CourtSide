import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import GameFeed from './pages/GameFeed';
import MatchHistory from './pages/MatchHistory';
import CourtDirectory from './pages/CourtDirectory';
import GearChecklist from './pages/GearChecklist';

function App() {
  // Try to load username from localStorage, defaulting to "Morgan"
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('courtside_user') || 'Morgan';
  });

  // Sync to localStorage when user changes
  useEffect(() => {
    localStorage.setItem('courtside_user', currentUser);
  }, [currentUser]);

  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home currentUser={currentUser} />} />
            <Route path="/games" element={<GameFeed />} />
            <Route path="/matches" element={<MatchHistory />} />
            <Route path="/courts" element={<CourtDirectory currentUser={currentUser} />} />
            <Route path="/checklists" element={<GearChecklist currentUser={currentUser} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
