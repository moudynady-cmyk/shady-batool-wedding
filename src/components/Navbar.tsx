import { useState } from "react";
import "../styles/navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar" aria-label="Main navigation">
      <a className="logo" href="#top" aria-label="Shady and Batool home">
        Shady <span aria-hidden="true">♥</span> Batool
      </a>

      <button
        type="button"
        className={`menu-btn ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen((open) => !open)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        aria-expanded={menuOpen}
        aria-controls="wedding-mobile-menu"
      >
        <span />
        <span />
        <span />
      </button>

      <div
        id="wedding-mobile-menu"
        className={`mobile-menu ${menuOpen ? "active" : ""}`}
      >
        <a href="#story" onClick={closeMenu}>Story</a>
        <a href="#timeline" onClick={closeMenu}>Timeline</a>
        <a href="#gallery" onClick={closeMenu}>Gallery</a>
        <a href="#details" onClick={closeMenu}>Wedding</a>
        <a href="#rsvp" onClick={closeMenu}>RSVP</a>
      </div>
    </nav>
  );
}
