import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaImage,
  FaFilm,
  FaClipboardList,
  FaCheckCircle,
  FaComments,
  FaRegNewspaper,
  FaCog,
  FaUser,
  FaClipboardCheck,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebookF,
} from "react-icons/fa";
import { FiX, FiChevronDown, FiChevronRight } from "react-icons/fi";
import "../styles/navbar.css";
import { Link } from "react-router";

export default function Sidebar({ open, onClose }) {
  const [factOpen, setFactOpen] = useState(true);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // disable highlight on mobile taps
  useEffect(() => {
    document.body.style.webkitTapHighlightColor = "transparent";
    return () => { document.body.style.webkitTapHighlightColor = ""; };
  }, []);

  return (
    <aside
      className={`vivid-sidebar ${open ? "open" : ""}`}
      aria-hidden={!open && "true"}
    >
      <div className="sidebar-inner">
        <div className="sidebar-top">
          <div className="profile">
            <FaUser size={18} className="profile-icon" />
            <div className="profile-name">Sachin</div>
          </div>

          <button
            className="close-mobile"
            onClick={onClose}
            aria-label="Close sidebar"
            type="button"
          >
            <FiX size={16} />
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          <a className="nav-item" href="#dashboard">
            <FaHome className="nav-ico" />
            <span>Dashboard</span>
          </a>

          <div className="nav-parent">
            <button
              className="nav-item parent"
              onClick={() => setFactOpen(v => !v)}
              aria-expanded={factOpen}
              aria-controls="fact-check-children"
              type="button"
            >
              <FaClipboardCheck className="nav-ico" />
              <span>Fact Check</span>
              <span className="parent-chevron" aria-hidden>
                {factOpen ? <FiChevronDown /> : <FiChevronRight />}
              </span>
            </button>

            {factOpen && (
              <div id="fact-check-children" className="nav-children">
                <a className="nav-item sub" href="#img">
                  <FaClipboardList className="nav-ico" />
                  <span>Text</span>
                </a>

                <a className="nav-item sub" href="#video">
                  <FaImage className="nav-ico" />
                  <span>Image</span>
                </a>

                <a className="nav-item sub" href="#text">
                  <FaFilm className="nav-ico" />
                  <span>Video</span>
                </a>
              </div>
            )}
          </div>

          <Link 
          to={"/pib"}
          className="nav-item" href="#verified">
            <FaCheckCircle className="nav-ico" />
            <span>PIB Verified</span>
          </Link>

          <a className="nav-item" href="#live">
            <FaComments className="nav-ico" />
            <span>Live Discussion</span>
          </a>

          <a className="nav-item" href="#blogs">
            <FaRegNewspaper className="nav-ico" />
            <span>Experts Blog</span>
          </a>

          <div className="nav-divider" />

          {/* spacer removed to keep everything visible; bottom social row is positioned absolutely */}
          <a className="nav-item bottom" href="#activity">
            <FaClipboardList className="nav-ico" />
            <span>My Activity</span>
          </a>

          <a className="nav-item bottom" href="#settings">
            <FaCog className="nav-ico" />
            <span>Settings</span>
          </a>

          {/* Social icons: bottom center */}
          <div className="socials" aria-hidden={false}>
            <a className="social-link" href="https://www.linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a className="social-link" href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X (Twitter)">
              <FaTwitter />
            </a>
            <a className="social-link" href="https://www.instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a className="social-link" href="https://www.facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
          </div>
        </nav>
      </div>
    </aside>
  );
}
