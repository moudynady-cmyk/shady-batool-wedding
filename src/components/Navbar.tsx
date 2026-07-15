import { useEffect, useState } from "react";
import "../styles/navbar.css";

const MENU_ITEMS = [
  { href: "#story", label: "Our Love Story" },
  { href: "#timeline", label: "Our Journey" },
  { href: "#details", label: "Our Day Details" },
  { href: "#rsvp", label: "RSVP" },
  { href: "#contact", label: "Need Any Help?" },
  { href: "#gallery", label: "Our Memories" },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

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
        aria-hidden={!menuOpen}
      >
        {MENU_ITEMS.map((item, index) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            <small aria-hidden="true">{String(index + 1).padStart(2, "0")}</small>
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
