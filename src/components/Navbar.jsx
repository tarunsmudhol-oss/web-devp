import React, { useState } from 'react';

function Navbar({ bookingCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar" aria-label="Main navigation">
      <div className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        🏏 IPL 2026
      </div>

      <button
        className="hamburger"
        type="button"
        aria-label="Toggle navigation"
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        {isOpen ? '✕' : '☰'}
      </button>

      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li>
          <a href="#home" onClick={closeMenu}>Home</a>
        </li>
        <li>
          <a href="#matches" onClick={closeMenu}>Matches</a>
        </li>
        <li>
          <a href="#mybookings" onClick={closeMenu}>
            My Bookings {bookingCount > 0 && <span className="booking-count">{bookingCount}</span>}
          </a>
        </li>
        <li>
          <a href="#guidelines" onClick={closeMenu}>Guidelines</a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
