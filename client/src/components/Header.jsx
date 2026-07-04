import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Header({
  user,
  onLogout,
  cartCount = 0,
  wishlistCount = 0,
  searchKeyword,
  setSearchKeyword
}) {

  const [searchText, setSearchText] = useState(searchKeyword || "");
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearchKeyword(searchText.trim());
    navigate("/");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="site-header">

      <div className="topbar-inner">

        {/* Logo */}

        <div className="brand-block">
          <Link to="/" className="brand">
            Shop<span>EZ</span>
          </Link>

          <p className="brand-subtitle">
            Explore. Shop. Save.
          </p>
        </div>

        {/* Search */}

        <div className="search-shell">

          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            type="button"
            onClick={handleSearch}
          >
            🔍 Search
          </button>

        </div>

        {/* Navigation */}

        <nav className="nav-links">

          {user ? (
            <>

              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="nav-pill"
                >
                  Admin
                </Link>
              )}

              {user.role === "seller" && (
                <Link
                  to="/seller"
                  className="nav-pill"
                >
                  Seller
                </Link>
              )}

              <Link
                to="/orders"
                className="nav-pill"
              >
                Orders
              </Link>

              <Link
                to="/profile"
                className="nav-pill"
              >
                Profile
              </Link>

              <Link
                to="/wishlist"
                className="nav-pill"
              >
                Wishlist
                {wishlistCount > 0 && ` (${wishlistCount})`}
              </Link>

              <Link
                to="/cart"
                className="nav-pill cart-pill"
              >
                Cart
                {cartCount > 0 && ` (${cartCount})`}
              </Link>

              <button
                className="ghost-btn"
                onClick={onLogout}
              >
                Logout
              </button>

            </>
          ) : (

            <Link
              to="/login"
              className="login-pill"
            >
              Login
            </Link>

          )}

        </nav>

      </div>

    </header>
  );
}

export default Header;