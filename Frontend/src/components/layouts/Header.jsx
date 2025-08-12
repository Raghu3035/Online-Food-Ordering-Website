import React from "react";
import Search from "./Search";
import { Link } from "react-router-dom";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useState, useEffect } from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';

export default function Header() {
  const alert = useAlert();
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const {cartItems}=useSelector((state) => state.cart);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged Out Successfully");
  };

  return (
    <nav className="navbar row sticky-top">
      {/* logo */}
      <div className="col-12 col-md-3">
        <Link to="/">
          <img src="/images/logo.webp" alt="Logo" className="logo" />
        </Link>
      </div>
      {/* Search Bar and Search Icon */}
      <div className="col-12 col-md-6 mt-2 mt-md-0">
        <Search />
      </div>
      <div className="col-12 col-md-3 mt-4 mt-md-0" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
        {/* Theme Toggle Switch */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginRight: 8,
          position: 'relative'
        }}>
          <button
            onClick={toggleTheme}
            style={{
              width: 60,
              height: 32,
              borderRadius: '16px',
              background: theme === 'light' 
                ? 'linear-gradient(145deg, #f0f0f0, #cacaca)' 
                : 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
              border: 'none',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: theme === 'light'
                ? 'inset 2px 2px 5px #d1d1d1, inset -2px -2px 5px #ffffff'
                : 'inset 2px 2px 5px #1a1a1a, inset -2px -2px 5px #3a3a3a',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {/* Sliding Indicator */}
            <div style={{
              position: 'absolute',
              top: '2px',
              left: theme === 'light' ? '2px' : 'calc(100% - 28px)',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #ffffff, #e6e6e6)',
              boxShadow: '2px 2px 4px #d1d1d1, -2px -2px 4px #ffffff',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {theme === 'light' ? (
                <FaSun size={10} style={{ color: '#ffb347' }} />
              ) : (
                <FaMoon size={10} style={{ color: '#667eea' }} />
              )}
            </div>
          </button>
        </div>

        <Link to={"/cart"} style={{textDecoration:"none"}}>
          <span className="ml-3" id="cart">Cart</span>
          <span className="ml-1" id="cart_count">{cartItems.length}</span>
        </Link>
        {user ? (
          <>
            <div className="ml-4 dropdown d-inline">
              <Link
                to="/"
                className="btn dropdown-toggle text-white mr-4"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <figure className="avatar avatar-nav">
                  <img
                    src={user.avatar.url}
                    alt="avatar"
                    className="rounded-circle"
                  />
                </figure>
                <span>{user && user.name}</span>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                <Link className="dropdown-item" to="/eats/orders/me/myOrders">
                  Orders
                </Link>
                <Link className="dropdown-item" to="/users/me">
                  Profile
                </Link>
                <Link className="dropdown-item" to="/" onClick={logoutHandler}>
                  Logout
                </Link>
              </div>
            </div>
          </>
        ) : (
          !loading && (
            <Link to="/users/login" className="btn ml-4" id="login_btn">
              Login
            </Link>
          )
        )}
      </div>
    </nav>
  );
}
