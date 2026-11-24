import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import MatchCard from './components/MatchCard.jsx';
import CheckoutModal from './components/CheckoutModal.jsx';
import { supabase } from '../supabase.js';

const INITIAL_MATCHES = [
  {
    id: "01",
    name: "CSK vs MI",
    teams: ["CSK", "MI"],
    date: "10 Apr 2026",
    time: "7:30 PM",
    venue: "M. A. Chidambaram Stadium, Chennai",
    prices: {
      General: 1200,
      Premium: 2500,
      VIP: 5000
    }
  },
  {
    id: "02",
    name: "RCB vs MI",
    teams: ["RCB", "MI"],
    date: "14 Apr 2026",
    time: "7:30 PM",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    prices: {
      General: 1500,
      Premium: 3000,
      VIP: 6000
    }
  },
  {
    id: "03",
    name: "DC vs CSK",
    teams: ["DC", "CSK"],
    date: "18 Apr 2026",
    time: "7:30 PM",
    venue: "Arun Jaitley Stadium, Delhi",
    prices: {
      General: 1400,
      Premium: 3200,
      VIP: 6500
    }
  },
  {
    id: "04",
    name: "RR vs RCB",
    teams: ["RR", "RCB"],
    date: "22 Apr 2026",
    time: "7:30 PM",
    venue: "Sawai Mansingh Stadium, Jaipur",
    prices: {
      General: 1800,
      Premium: 3500,
      VIP: 7000
    }
  }
];

function App() {
  const [matches] = useState(INITIAL_MATCHES);
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [bookings, setBookings] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [checkoutBooking, setCheckoutBooking] = useState(null);

  useEffect(() => {
    const loadBookings = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booked_at', { ascending: false });

      if (error) {
        console.error('Unable to load bookings from Supabase:', error);
        triggerToast('Unable to load bookings. Check your Supabase table and policies.');
      } else {
        setBookings(data || []);
      }

      setIsLoadingBookings(false);
    };

    loadBookings();
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  };

  const handleBookMatch = (bookingData) => {
    setCheckoutBooking(bookingData);
  };

  const handlePayment = async (bookingData) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        match_id: bookingData.matchId,
        match_name: bookingData.matchName,
        date: bookingData.date,
        venue: bookingData.venue,
        stand: bookingData.stand,
        tickets: bookingData.tickets,
        total: bookingData.total,
      })
      .select()
      .single();

    if (error) {
      console.error('Unable to save booking to Supabase:', error);
      if (error.message?.includes('Could not find the table')) {
        throw new Error(
          'The public.bookings table is missing. Run supabase-schema.sql in Supabase SQL Editor, then reload the app.'
        );
      }
      if (error.message?.includes('Invalid API key')) {
        throw new Error(
          'The Supabase API key is invalid. Check VITE_SUPABASE_ANON_KEY in .env.local.'
        );
      }
      throw new Error(
        `Unable to save booking: ${error.message || 'Unknown Supabase error'}`
      );
    }

    setBookings((prev) => [data, ...prev]);
    triggerToast(`🎉 Booked ${bookingData.tickets} ticket(s) for ${bookingData.matchName}!`);
    return data;
  };

  // Filter matches based on team selection
  const filteredMatches = matches.filter((match) => {
    if (selectedTeam === 'all') return true;
    return match.teams.includes(selectedTeam);
  });

  return (
    <div className="app-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="toast"
          className="toast"
        >
          {toastMessage}
        </div>
      )}

      {/* Main Header */}
      <header className="main-header">
        <h1>IPL Ticket Booking 2026</h1>
      </header>

      {/* Reusable Navbar Component */}
      <Navbar bookingCount={bookings.length} />

      <main>
        {/* Reusable Hero Component */}
        <Hero
          onExploreClick={() => {
            const el = document.getElementById('matches');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* About Section */}
        <section className="about">
          <h2>About IPL 2026</h2>
          <p>
            IPL 2026 is an exciting cricket tournament featuring popular teams competing against
            each other. Experience thrilling matches and enjoy the stadium atmosphere live!
          </p>
        </section>

        {/* Schedule & Match List Section */}
        <section className="schedule" id="matches">
          <h2>IPL Match Schedule</h2>

          <div className="match-controls">
            {/* Team Filter (State Controlled) */}
            <div className="filter">
              <label htmlFor="team-filter">
                Filter By Team:
              </label>
              <select
                id="team-filter"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="all">All Teams</option>
                <option value="CSK">CSK</option>
                <option value="MI">MI</option>
                <option value="RCB">RCB</option>
                <option value="DC">DC</option>
                <option value="RR">RR</option>
              </select>
            </div>

            {/* View Mode Controls (State Controlled) */}
            <div className="view-controls">
              <button
                type="button"
                className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                Grid View
              </button>
              <button
                type="button"
                className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
              >
                List View
              </button>
            </div>
          </div>

          {/* Render List of Matches mapping over match data & Reusing MatchCard */}
          <div className={`match-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
            {filteredMatches.length > 0 ? (
              filteredMatches.map((match) => (
                <MatchCard key={match.id} match={match} onBook={handleBookMatch} />
              ))
            ) : (
              <p className="no-matches">
                No matches found for the selected team filter.
              </p>
            )}
          </div>
        </section>

        {/* My Bookings Section (Rebuilt parts of Booking UI with JSX & State) */}
        <section className="mybookings" id="mybookings">
          <h2>My Ticket Bookings</h2>

          {isLoadingBookings ? (
            <div className="empty-bookings">
              Loading bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="empty-bookings">
              <p className="empty-title">No bookings yet.</p>
              <p>
                Select a match above and click <strong>Book Ticket</strong> to create your first booking!
              </p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Match</th>
                    <th>Date &amp; Time</th>
                    <th>📍 Location / Stadium</th>
                    <th>Stand Category</th>
                    <th>Tickets</th>
                    <th>Total Amount</th>
                    <th>Booked At</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id}>
                      <td>
                        <strong>{b.match_name}</strong>
                      </td>
                      <td>{b.date}</td>
                      <td>
                        <strong>📍 {b.venue}</strong>
                      </td>
                      <td>
                        <span className="stand-badge">
                          {b.stand}
                        </span>
                      </td>
                      <td>{b.tickets}</td>
                      <td>
                        <strong className="amount">₹{b.total}</strong>
                      </td>
                      <td>{b.booked_at ? new Date(b.booked_at).toLocaleTimeString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Stadium Guidelines Section */}
        <section id="guidelines" className="guidelines-section">
          <h2>Stadium Guidelines</h2>
          <div className="guidelines-container">
            <article className="card">
              <h3>Ticket Verification</h3>
              <p>Verify your ticket before entering the stadium. Carry a valid digital or printed pass.</p>
            </article>

            <article className="card">
              <h3>ID Proof Requirement</h3>
              <p>Carry a valid government-issued ID proof along with your ticket for seamless entry.</p>
            </article>

            <article className="card">
              <h3>Prohibited Items</h3>
              <p>Outside food, hazardous objects, and restricted items are strictly prohibited inside.</p>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2026 IPL Ticket Booking. All Rights Reserved.</p>
      </footer>

      {checkoutBooking && (
        <CheckoutModal
          booking={checkoutBooking}
          onConfirm={handlePayment}
          onClose={() => setCheckoutBooking(null)}
        />
      )}
    </div>
  );
}

export default App;
