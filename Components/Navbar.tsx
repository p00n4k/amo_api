"use client";

import React, { useState } from "react";
import Link from "next/link";
import "./Navbar.css";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <div className="navbar-container">
                <nav className="navbar">
                    <div className="navbar-content">
                        {/* Left navigation - Desktop only */}
                        <div className="navbar-left">
                            <Link href="/home" className="nav-link">Home</Link>
                            <Link href="/product" className="nav-link">Product</Link>
                            <Link href="/projects" className="nav-link">Project</Link>
                        </div>

                        {/* Middle Logo */}
                        <div className="navbar-logo">
                            <Link href="/">
                                <div className="logo-text">Amo</div>
                            </Link>
                        </div>

                        {/* Right navigation - Desktop only */}
                        <div className="navbar-right">
                            {/* Line Icon with hover effect */}
                            <a href="https://line.me/ti/p/~amocorner" className="icon-link group">
                                <img src="/static/line.png" alt="Line Logo" className="icon" />
                                <span className="hidden_line">amocorner</span>
                            </a>

                            {/* Get in Touch Button */}
                            <Link href="/about" className="cta-button">Get in touch</Link>
                        </div>

                        {/* Hamburger Button - Mobile only */}
                        <button
                            className={`hamburger-button ${isMenuOpen ? "hamburger-open" : ""}`}
                            onClick={toggleMenu}
                            aria-label="Toggle menu"
                        >
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                            <span className="hamburger-line"></span>
                        </button>
                    </div>
                </nav>
            </div>

            {/* Mobile Menu */}
            <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
                <Link href="/home" className="nav-link" onClick={closeMenu}>Home</Link>
                <Link href="/product" className="nav-link" onClick={closeMenu}>Product</Link>
                <Link href="/projects" className="nav-link" onClick={closeMenu}>Project</Link>

                {/* Line Icon */}
                <a
                href="https://line.me/ti/p/~amocorner"
                className="icon-link"
                onClick={closeMenu}
                target="_blank"
                rel="noopener noreferrer"
                >
                <img src="/static/line.png" alt="Line Logo" className="icon" />
                <span className="hidden_line">amocorner</span>
                </a>



                {/* Get in Touch Button */}
                <Link href="/about" className="cta-button" onClick={closeMenu}>Get in touch</Link>
            </div>
        </>
    );
};

export default Navbar;
