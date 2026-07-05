import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cartApi, orderApi, paymentApi, productApi } from '../services/api';
import CheckoutModal from '../components/CheckoutModal';

function CartPage({ user, onCartUpdated }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [directBuyProduct, setDirectBuyProduct] = useState(null);
  const [directBuyProductId, setDirectBuyProductId] = useState(null);
  const [directBuyQuantity, setDirectBuyQuantity] = useState(1);
  const [directBuyActive, setDirectBuyActive] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });
  const [methods, setMethods] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const loadCart = async () => {
    try {
      const response = await cartApi.get();
      setCart(response.data?.data || { items: [], totalPrice: 0 });
    } catch (err) {
      console.error(err);
      setCart({ items: [], totalPrice: 0 });
    }
  };

  useEffect(() => {
    loadCart();
    paymentApi.methods().then((response) => setMethods(response.data?.data || []));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const buyNowProductId = params.get('buyNowProduct');
    const buyNowQty = Math.max(1, Number(params.get('qty')) || 1);

    if (buyNowProductId) {
      setDirectBuyActive(true);
      setDirectBuyProductId(buyNowProductId);
      setDirectBuyQuantity(buyNowQty);
      setShowCheckout(true);
      loadDirectBuyProduct(buyNowProductId);
    } else {
      setDirectBuyActive(false);
      setDirectBuyProduct(null);
      setDirectBuyProductId(null);
      setDirectBuyQuantity(1);
    }
  }, [location.search]);

  const loadDirectBuyProduct = async (productId) => {
    try {
      const response = await productApi.get(productId);
      setDirectBuyProduct(response.data?.data || null);
    } catch (err) {
      console.error('Unable to load buy now product', err);
      setDirectBuyProduct(null);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartApi.update(productId, quantity);
      loadCart();
      onCartUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update quantity');
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartApi.remove(productId);
      loadCart();
      onCartUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to remove item');
    }
  };

  const clearDirectBuy = () => {
    setDirectBuyActive(false);
    setDirectBuyProduct(null);
    setDirectBuyProductId(null);
    setDirectBuyQuantity(1);
    navigate('/cart', { replace: true });
  };

  const placeOrder = async () => {
    setShowCheckout(true);
  };

  const confirmOrder = async () => {
    try {
      setIsPlacingOrder(true);
      const orderPayload = {
        shippingAddress,
        paymentMethod,
      };

      if (directBuyActive && directBuyProductId) {
        orderPayload.productId = directBuyProductId;
        orderPayload.quantity = directBuyQuantity;
      }

      const orderResponse = await orderApi.create(orderPayload);
      const orderId = orderResponse.data?.data?._id;
      await paymentApi.create({ orderId, paymentMethod });
      alert('Order placed successfully');
      setShowCheckout(false);
      if (directBuyActive) {
        clearDirectBuy();
      }
      loadCart();
      onCartUpdated();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const cartItemCount = cart?.items?.length || 0;
  const cartSubtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const directBuySubtotal = directBuyActive && directBuyProduct ? directBuyProduct.price * directBuyQuantity : 0;
  const subtotal = directBuyActive ? directBuySubtotal : cartSubtotal;
  const discount = Math.round(subtotal * 0.05);
  const deliveryCharges = subtotal > 0 ? 40 : 0;
  const totalAmount = subtotal - discount + deliveryCharges;

  return (
    <div className="page cart-page">
      <h1>Shopping Cart</h1>
      {!directBuyActive && cartItemCount === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-layout">
          <section className="cart-list">
            {directBuyActive && directBuyProduct ? (
              <div className="cart-list-header">
                <div>
                  <h2>Buy Now Item</h2>
                  <p>{directBuyQuantity} item{directBuyQuantity !== 1 ? 's' : ''}</p>
                </div>
              </div>
            ) : (
              <div className="cart-list-header">
                <div>
                  <h2>My Cart</h2>
                  <p>{cartItemCount} item{cartItemCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            )}

            {directBuyActive && directBuyProduct ? (
              <article key={directBuyProduct._id} className="cart-item-card">
                <div className="cart-item-left">
                  <img
                    src={directBuyProduct.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                    alt={directBuyProduct.title}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <p className="product-brand">{directBuyProduct.category?.name || 'Brand'}</p>
                    <h3>{directBuyProduct.title}</h3>
                    <div className="price-row">
                      <span className="cart-item-price">₹{directBuyProduct.price}</span>
                      <span className="cart-item-old-price">₹{Math.round(directBuyProduct.price * 1.15)}</span>
                      <span className="cart-item-discount">15% off</span>
                    </div>
                    <p className="delivery-text">Delivery by tomorrow | ₹40 delivery charges</p>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="counter-row">
                    <span>Qty</span>
                    <span>{directBuyQuantity}</span>
                  </div>
                  <div className="cart-item-links">
                    <button type="button" className="ghost-btn" onClick={() => setDirectBuyActive(false)}><span className="icon">✕</span> Cancel</button>
                  </div>
                </div>
              </article>
            ) : (
              cart?.items?.map((item) => (
                <article key={item.product?._id} className="cart-item-card">
                  <div className="cart-item-left">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80'}
                      alt={item.product?.title}
                      className="cart-item-image"
                    />
                    <div className="cart-item-details">
                      <p className="product-brand">{item.product?.category?.name || 'Brand'}</p>
                      <h3>{item.product?.title}</h3>
                      <div className="price-row">
                        <span className="cart-item-price">₹{item.price}</span>
                        <span className="cart-item-old-price">₹{Math.round(item.price * 1.15)}</span>
                        <span className="cart-item-discount">15% off</span>
                      </div>
                      <p className="delivery-text">Delivery by tomorrow | ₹40 delivery charges</p>
                    </div>
                  </div>

                  <div className="cart-item-actions">
                    <div className="counter-row">
                      <button type="button" onClick={() => updateQuantity(item.product?._id, Math.max(item.quantity - 1, 1))}>-</button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}>+</button>
                    </div>
                    <div className="cart-item-links">
                      <button type="button" className="ghost-btn" onClick={() => removeItem(item.product?._id)}><span className="icon">🗑️</span> Remove</button>
                      <button type="button" className="ghost-btn"><span className="icon">♥</span> Save for later</button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>

          <aside className="checkout-card cart-summary-card">
            <h2>Price Details</h2>
            <div className="price-detail-row">
              <span>Price ({directBuyActive ? directBuyQuantity : cart?.items?.length || 0} item{(directBuyActive ? directBuyQuantity : cart?.items?.length || 0) !== 1 ? 's' : ''})</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="price-detail-row">
              <span>Discount</span>
              <span className="discount-text">-₹{discount}</span>
            </div>
            <div className="price-detail-row">
              <span>Delivery Charges</span>
              <span>₹{deliveryCharges}</span>
            </div>
            <div className="price-detail-row total-row">
              <strong>Total Amount</strong>
              <strong>₹{totalAmount}</strong>
            </div>
            <div className="price-detail-note">You will save ₹{discount} on this order</div>
            <button className="primary-btn full-width" onClick={placeOrder}>Place Order</button>
          </aside>
        </div>
      )}

      <CheckoutModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        onSubmit={confirmOrder}
        shippingAddress={shippingAddress}
        setShippingAddress={setShippingAddress}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        methods={methods}
        subtotal={subtotal}
        discount={discount}
        deliveryCharges={deliveryCharges}
        totalAmount={totalAmount}
        directBuyProduct={directBuyProduct}
        directBuyQuantity={directBuyQuantity}
      />
    </div>
  );
}

export default CartPage;
