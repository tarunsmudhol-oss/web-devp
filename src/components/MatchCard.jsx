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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontSize: '13px', fontWeight: 'bold', background: '#092c5c', color: 'white', padding: '3px 8px', borderRadius: '4px' }}>
          Match #{id}
        </span>
        <span style={{ fontSize: '13px', color: '#666', fontWeight: 'bold' }}>
          📅 {date} {time && `• ${time}`}
        </span>
      </div>

      <h3 style={{ fontSize: '20px', margin: '8px 0 4px', color: '#092c5c' }}>{name}</h3>

      {/* Prominent Match Location & Venue */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#e8f0fe',
          color: '#123f78',
          border: '1px solid #c2d7fa',
          padding: '6px 12px',
          borderRadius: '6px',
          margin: '8px 0 12px',
          fontSize: '13.5px',
          fontWeight: 'bold',
          width: '100%',
        }}
      >
        <span>📍</span>
        <span>
          <strong>Location:</strong> {venue}
        </span>
      </div>

      {/* Stand Selection */}
      <div style={{ margin: '15px 0' }}>
        <label htmlFor={`stand-${id}`} style={{ fontSize: '14px', marginBottom: '6px' }}>
          Select Category:
        </label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
          {Object.entries(prices).map(([stand, price]) => (
            <button
              key={stand}
              type="button"
              onClick={() => setSelectedStand(stand)}
              style={{
                flex: '1',
                minWidth: '80px',
                padding: '8px 6px',
                border: selectedStand === stand ? '2px solid #092c5c' : '1px solid #ccc',
                background: selectedStand === stand ? '#eef4fc' : 'white',
                borderRadius: '6px',
                cursor: 'pointer',
                textAlign: 'center',
                fontWeight: selectedStand === stand ? 'bold' : 'normal',
                color: selectedStand === stand ? '#092c5c' : '#333',
              }}
            >
              <div>{stand}</div>
              <div style={{ fontSize: '13px', color: '#e63946', fontWeight: 'bold' }}>₹{price}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Ticket quantity & Total */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '15px 0', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label htmlFor={`tickets-${id}`} style={{ fontSize: '14px', margin: 0 }}>
            Qty:
          </label>
          <select
            id={`tickets-${id}`}
            value={ticketCount}
            onChange={(e) => setTicketCount(Number(e.target.value))}
            style={{ width: '65px', padding: '6px' }}
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', color: '#777' }}>Total: </span>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#092c5c' }}>
            ₹{totalPrice}
          </span>
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        className="book-btn"
        onClick={handleBooking}
        style={{
          width: '100%',
          backgroundColor: '#092c5c',
          transition: 'background-color 0.3s ease',
        }}
      >
        {`Book Ticket • ₹${totalPrice}`}
      </button>
    </article>
  );
}

export default MatchCard;
