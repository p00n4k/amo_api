"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import "./Homeslider.css";

export default function HomeSlider() {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // ✅ โหลดภาพทั้งหมดจาก API
    useEffect(() => {
        const fetchSlider = async () => {
            try {
                const res = await fetch("/api/homeslider");
                const data = await res.json();

                if (Array.isArray(data) && data.length > 0) {
                    // เรียงตาม display_order และเก็บเฉพาะ image_url
                    const sortedImages = data
                        .sort((a, b) => a.display_order - b.display_order)
                        .map(item => item.image_url);
                    setImages(sortedImages);
                } else {
                    setImages(["/images/01_pd_focus_atlasconcorde.jpg"]);
                }
            } catch (error) {
                console.error("Error fetching home slider:", error);
                setImages(["/images/01_pd_focus_atlasconcorde.jpg"]);
            } finally {
                setLoading(false);
            }
        };

        fetchSlider();
    }, []);

    // ✅ Auto-slide ทุก 5 วินาที
    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    // ฟังก์ชันควบคุม slider
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {loading ? (
                <div className="h-screen flex items-center justify-center bg-gray-200 text-gray-600">
                    กำลังโหลดภาพ...
                </div>
            ) : (
                <>
                    {/* ภาพ Slider */}
                    {images.map((image, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Image
                                src={image}
                                alt={`Slide ${index + 1}`}
                                fill
                                priority={index === 0}
                                className="object-cover"
                            />
                        </div>
                    ))}

                    {/* ปุ่มลูกศร */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={goToPrevious}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition"
                                aria-label="Previous slide"
                            >
                                ←
                            </button>
                            <button
                                onClick={goToNext}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full z-10 transition"
                                aria-label="Next slide"
                            >
                                →
                            </button>
                        </>
                    )}

                    {/* จุด Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition ${index === currentIndex
                                        ? "bg-white w-8"
                                        : "bg-white/50"
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}