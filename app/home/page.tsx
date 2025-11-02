"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./home.css";

export default function Home() {
    const [firstImage, setFirstImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // ✅ โหลดเฉพาะภาพแรกจาก API /api/homeslider
    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/homeslider");
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    setFirstImage(data[0].image_url);
                } else {
                    setFirstImage("/images/01_pd_focus_atlasconcorde.jpg");
                }
            } catch (error) {
                console.error("Error fetching home slider:", error);
                setFirstImage("/images/01_pd_focus_atlasconcorde.jpg");
            } finally {
                setLoading(false);
            }
        };

        fetchSlider();
    }, []);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {loading ? (
                <div className="h-screen flex items-center justify-center bg-gray-200 text-gray-600">
                    กำลังโหลดภาพ...
                </div>
            ) : (
                firstImage && (
                    <div className="relative h-screen w-full">
                        <Image
                            src={firstImage}
                            alt="Home Slider"
                            fill
                            priority
                            className="object-cover fade-in"
                        />
                        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/60 px-6 py-4 rounded-xl text-white text-center">
                            <h1 className="text-3xl md:text-5xl font-semibold mb-2">
                                Discover Amo Collections
                            </h1>
                            <p className="text-gray-300 text-base md:text-lg">
                                Your inspiration for design begins here
                            </p>
                        </div>
                    </div>
                )
            )}
        </div>
    );
}
