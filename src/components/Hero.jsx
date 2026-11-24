import React from 'react';

function Hero({ onExploreClick }) {
  const handleScrollToMatches = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('matches');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero" id="home">
      <h2>Welcome to IPL 2026</h2>
      <p>Experience The Stadium Energy Live!</p>
      <div>
        <button
          type="button"
          className="btn"
          onClick={handleScrollToMatches}
          style={{ cursor: 'pointer' }}
        >
          View Schedule
        </button>
        <button
          type="button"
          className="btn"
          onClick={handleScrollToMatches}
          style={{ cursor: 'pointer' }}
        >
          Book Ticket
        </button>
      </div>
    </section>
  );
}

export default Hero;
