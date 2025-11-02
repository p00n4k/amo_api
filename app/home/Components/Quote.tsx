"use client";

import React from "react";
import "./Quote.css";

export default function Quote() {
    return (
        <section className="quote">
            <div className="quote__content">
                <h2 className="quote__title">
                    From the beginning to the end
                    <br />
                    of your home renovation
                    <br />
                    or decoration process,
                </h2>
                <p className="quote__subtitle">
                    We can assure you the satisfaction
                    <br />
                    with our <span className="quote__highlight">goods and services.</span>
                </p>
                <div className="quote__mark">”</div>
            </div>
        </section>
    );
}
