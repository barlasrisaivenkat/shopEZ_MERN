function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>ShopEZ</h3>
          <p>
            ShopEZ is your trusted online shopping destination for
            Electronics, Fashion, Home Appliances and much more.
          </p>
        </div>

        <div className="footer-column">
          <h4>Customer Care</h4>
          <a href="#">Help Center</a>
          <a href="#">Track Order</a>
          <a href="#">Returns</a>
          <a href="#">Refund Policy</a>
          <a href="#">FAQs</a>
        </div>

        <div className="footer-column">
          <h4>Categories</h4>
          <a href="#">Mobiles</a>
          <a href="#">Electronics</a>
          <a href="#">Fashion</a>
          <a href="#">Home & Kitchen</a>
          <a href="#">Books</a>
        </div>

        <div className="footer-column">
          <h4>Contact Us</h4>

          <p>📍 Vijayawada, Andhra Pradesh</p>

          <p>📞 +91 9876543210</p>

          <p>✉ support@shopez.com</p>

          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">Twitter</a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">

        <div className="payment-icons">
          💳 Visa &nbsp; 💳 MasterCard &nbsp; 🏦 UPI &nbsp; 📱 Paytm &nbsp; 💰 COD
        </div>

        <p>
          © 2026 ShopEZ. All Rights Reserved.
        </p>

        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">About Us</a>
        </div>

      </div>
    </footer>
  );
}

export default Footer;