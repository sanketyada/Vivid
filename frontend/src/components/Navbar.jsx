import React from "react";
import { FiMenu } from "react-icons/fi";
import { FaBell } from "react-icons/fa";
import "../styles/navbar.css";

export default function Navbar({ onToggleMenu }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="left">
          {/* hamburger: visible only on small screens */}
          <button className="hamburger" onClick={onToggleMenu} aria-label="Toggle menu">
            <FiMenu size={20} />
          </button>

          <span className="brand">ViVid</span>
        </div>

        <div className="right">
          <button className="notif" aria-label="Notifications">
            <FaBell size={20} />
            <span className="notif-badge">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}
