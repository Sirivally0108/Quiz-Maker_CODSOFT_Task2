import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    setMenuOpen(false);
    navigate('/');
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          QuizMaker
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/quizzes" onClick={closeMenu}>Quizzes</Link>
          {user && <Link to="/create-quiz" onClick={closeMenu}>Create Quiz</Link>}
          {user && <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>}
          {!user && <Link to="/login" onClick={closeMenu}>Login</Link>}
          {!user && <Link to="/register" onClick={closeMenu}>Register</Link>}
          {user && (
            <button className="navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
