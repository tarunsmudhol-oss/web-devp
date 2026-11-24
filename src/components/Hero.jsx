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
      <div className="hero-copy">
        <span className="hero-kicker">IPL 2026 · Match Week</span>
        <h2>Feel the stadium. Own the moment.</h2>
        <p>Discover the biggest fixtures and secure your seat for every unforgettable over.</p>
        <div className="hero-actions">
        <button
          type="button"
          className="btn"
          onClick={handleScrollToMatches}
        >
          Explore matches
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleScrollToMatches}
        >
          Book a ticket
        </button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
