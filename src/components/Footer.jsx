import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <p>&copy; {new Date().getFullYear()} <strong>CourtSide</strong> — Sports Matcher & Court Tracker.</p>
        <p className="footer-meta">
          Built by <strong>@Harini Thirunavukkarasan</strong> & <strong>@Wu Hung Hsiao</strong> for 
          <a href="https://johnguerra.co/classes/webDevelopment_online_summer_2026/" target="_blank" rel="noreferrer" className="footer-link"> CS 5610 Web Development</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
