import React, { useState } from 'react';

function CheckoutModal({ booking, onConfirm, onClose }) {
  const [customer, setCustomer] = useState({ name: '', email: '' });
  const [payment, setPayment] = useState({ cardNumber: '', expiry: '', cvv: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (setter) => (event) => {
    setter((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsProcessing(true);

    try {
      const savedBooking = await onConfirm({
        ...booking,
        customerName: customer.name,
        customerEmail: customer.email,
      });
      setConfirmation(savedBooking);
      setConfirmed(true);
    } catch (error) {
      console.error('Payment or booking failed:', error);
      setErrorMessage(error.message || 'Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="checkout-backdrop" role="presentation">
      <section className="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        {confirmed ? (
          <div className="confirmation-panel">
            <div className="confirmation-icon">✓</div>
            <h2 id="checkout-title">Booking Confirmed!</h2>
            <p>Your fake payment was successful and your tickets are reserved.</p>
            <div className="confirmation-code">
              Booking ID: <strong>IPL-{confirmation.id}</strong>
            </div>
            <button type="button" className="submit-btn" onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            <div className="checkout-header">
              <div>
                <p className="checkout-kicker">Secure checkout</p>
                <h2 id="checkout-title">Complete your booking</h2>
              </div>
              <button type="button" className="close-button" onClick={onClose} aria-label="Close checkout">×</button>
            </div>

            <div className="checkout-summary">
              <strong>{booking.matchName}</strong>
              <span>{booking.date}</span>
              <span>{booking.venue}</span>
              <span>{booking.stand} · {booking.tickets} ticket(s)</span>
              <strong className="checkout-total">₹{booking.total}</strong>
            </div>

            <form onSubmit={handleSubmit}>
              <h3>Contact details</h3>
              <div className="checkout-fields">
                <label>
                  Full name
                  <input name="name" value={customer.name} onChange={updateField(setCustomer)} required />
                </label>
                <label>
                  Email address
                  <input type="email" name="email" value={customer.email} onChange={updateField(setCustomer)} required />
                </label>
              </div>

              <h3>Demo payment</h3>
              <p className="demo-payment-note">This is a fake payment screen. No real money will be charged.</p>
              <div className="checkout-fields">
                <label>
                  Card number
                  <input name="cardNumber" inputMode="numeric" placeholder="4242 4242 4242 4242" value={payment.cardNumber} onChange={updateField(setPayment)} minLength="12" required />
                </label>
                <div className="checkout-row">
                  <label>
                    Expiry
                    <input name="expiry" placeholder="MM/YY" value={payment.expiry} onChange={updateField(setPayment)} required />
                  </label>
                  <label>
                    CVV
                    <input name="cvv" inputMode="numeric" placeholder="123" value={payment.cvv} onChange={updateField(setPayment)} minLength="3" maxLength="4" required />
                  </label>
                </div>
              </div>

              {errorMessage && <p className="checkout-error" role="alert">{errorMessage}</p>}
              <button type="submit" className="submit-btn" disabled={isProcessing}>
                {isProcessing ? 'Processing fake payment...' : `Pay ₹${booking.total} securely`}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}

export default CheckoutModal;
