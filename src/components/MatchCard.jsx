import React, { useState } from 'react';

function MatchCard({ match, onBook }) {
  const { id, name, date, time, venue, prices } = match;

  // Component State for interactive booking selection
  const [selectedStand, setSelectedStand] = useState('General');
  const [ticketCount, setTicketCount] = useState(1);

  const currentPrice = prices[selectedStand] || 0;
  const totalPrice = currentPrice * ticketCount;

  const handleBooking = () => {
    if (onBook) {
      onBook({
        matchId: id,
        matchName: name,
        date: `${date} ${time || ''}`.trim(),
        venue,
        stand: selectedStand,
        tickets: ticketCount,
        total: totalPrice,
      });
    }
  };

  return (
    <article className="match-card">
      <div className="match-card-header">
        <span className="match-number">
          Match #{id}
        </span>
        <span className="match-date">
          📅 {date} {time && `• ${time}`}
        </span>
      </div>

      <h3>{name}</h3>

      <div className="match-location">
        <span>📍</span>
        <span>
          {venue}
        </span>
      </div>

      <div className="stand-label">Select category</div>
      <div className="stand-options">
          {Object.entries(prices).map(([stand, price]) => (
            <button
              key={stand}
              type="button"
              className={`stand-button ${selectedStand === stand ? 'selected' : ''}`}
              onClick={() => setSelectedStand(stand)}
            >
              <strong>{stand}</strong>
              <span>₹{price}</span>
            </button>
          ))}
      </div>

      <div className="ticket-row">
        <div className="ticket-qty">
          <label htmlFor={`tickets-${id}`}>Qty:</label>
          <select
            id={`tickets-${id}`}
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="ticket-total">
          <span>Total</span>
          <strong>₹{totalPrice}</strong>
        </div>
      </div>

      <button
        type="button"
        className="book-btn"
        onClick={handleBooking}
      >
        {`Book Ticket • ₹${totalPrice}`}
      </button>
    </article>
  );
}

export default MatchCard;
