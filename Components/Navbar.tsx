"use client";

import React from "react";
import Link from "next/link"; // ✅ Import Link from next/link
import "./Navbar.css"; // Use relative import if in same folder

const Navbar = () => {
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-content">
                    {/* Left navigation */}
                    <div className="navbar-left">
                        <Link href="/home" className="nav-link">Home</Link>
                        <Link href="/product" className="nav-link">Product</Link>
                        <Link href="/projects" className="nav-link">Project</Link>
                    </div>

                    {/* Middle Logo */}
                    <div className="navbar-logo">
                        <div className="logo-text">Amo</div>
                    </div>

                    {/* Right navigation */}
                    <div className="navbar-right">
                        {/* Line Icon with hover effect */}
                        <Link href="/" className="icon-link group">
                            <img src="/static/line.png" alt="Line Logo" className="icon" />
                            <span className="hidden_line">amocorner</span>
                        </Link>

                        {/* Get in Touch Button */}
                        <Link href="/about" className="cta-button">Get in touch</Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
