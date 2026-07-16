import React from 'react';

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
      <style>{`
        .footer {
          background-color: #0f172a;
          color: #94a3b8;
          padding: 2rem 1.5rem;
          border-top: 1px solid #1e293b;
          font-size: 0.85rem;
          text-align: center;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .footer-meta {
          color: #64748b;
        }

        .footer-link {
          color: #3b82f6;
          transition: color 0.2s ease;
        }

        .footer-link:hover {
          color: #60a5fa;
          text-decoration: underline;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
