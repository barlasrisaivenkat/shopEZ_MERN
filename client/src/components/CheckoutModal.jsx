function CheckoutModal({ open, onClose, onSubmit, shippingAddress, setShippingAddress, paymentMethod, setPaymentMethod, methods, subtotal, discount, deliveryCharges, totalAmount }) {
  if (!open) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="checkout-modal">
        <div className="modal-header">
          <div>
            <h2>Enter delivery address & payment</h2>
            <p className="muted-text">Complete your order with a shipping address and preferred payment method.</p>
          </div>
          <button type="button" className="ghost-btn" onClick={onClose}>Close</button>
        </div>

        <div className="checkout-grid">
          <form className="checkout-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
            <div className="form-row">
              <label>
                Full name
                <input
                  type="text"
                  value={shippingAddress.fullName}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, fullName: event.target.value })}
                  required
                />
              </label>
              <label>
                Phone
                <input
                  type="tel"
                  value={shippingAddress.phone}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, phone: event.target.value })}
                  required
                />
              </label>
            </div>

            <label>
              Street address
              <input
                type="text"
                value={shippingAddress.street}
                onChange={(event) => setShippingAddress({ ...shippingAddress, street: event.target.value })}
                required
              />
            </label>

            <div className="form-row">
              <label>
                City
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, city: event.target.value })}
                  required
                />
              </label>
              <label>
                State
                <input
                  type="text"
                  value={shippingAddress.state}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, state: event.target.value })}
                  required
                />
            </label>
            </div>

            <div className="form-row">
              <label>
                Pincode
                <input
                  type="text"
                  value={shippingAddress.pincode}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, pincode: event.target.value })}
                  required
                />
              </label>
              <label>
                Country
                <input
                  type="text"
                  value={shippingAddress.country}
                  onChange={(event) => setShippingAddress({ ...shippingAddress, country: event.target.value })}
                  required
                />
              </label>
            </div>

            <label>
              Payment method
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)} required>
                <option value="" disabled>{methods.length === 0 ? 'Loading methods...' : 'Select payment method'}</option>
                {methods.map((method) => (
                  <option key={method.id} value={method.id} disabled={!method.enabled}>
                    {method.label || method.name || method.id}{!method.enabled ? ' (coming soon)' : ''}
                  </option>
                ))}
              </select>
            </label>

            <div className="modal-footer">
              <button type="button" className="secondary-btn outline-btn" onClick={onClose}>Cancel</button>
              <button type="submit" className="primary-btn">Confirm & Place Order</button>
            </div>
          </form>

          <aside className="order-summary">
            <h3>Order summary</h3>
            <div className="summary-row">
              <span>Price</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Discount</span>
              <span className="discount-text">-₹{discount}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>₹{deliveryCharges}</span>
            </div>
            <div className="summary-row total-row">
              <strong>Total</strong>
              <strong>₹{totalAmount}</strong>
            </div>
            <p className="price-detail-note">You save ₹{discount} on this order.</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CheckoutModal;
