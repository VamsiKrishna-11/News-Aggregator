import React from 'react';
import './Navbar.css';

export default function Navbar({
  searchTerm,
  onSearchChange,
  user,
  onOpenAuth,
  onOpenDrawer,
  onLogout
}) {
  return (
    <header className="navbar">
      <div className="brand-logo">NewsAggregator</div>
      <div className="nav-actions">
        <input
          type="text"
          className="search-box"
          placeholder="Search headlines..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {user ? (
          <>
            <button className="btn-primary" onClick={onOpenDrawer}>Saved</button>
            <button className="btn-bookmark" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <button className="btn-primary" onClick={onOpenAuth}>Sign In</button>
        )}
      </div>
    </header>
  );
}