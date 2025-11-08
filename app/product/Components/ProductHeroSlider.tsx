"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function ProductHeroSlider() {
    const [images, setImages] = useState<string[]>([]);
    const [collectionName, setCollectionName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [link, setLink] = useState("#");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/productmain");
                const data = await res.json();

                setCollectionName(data.collection_name);
                setBrandName(data.brand_name);
                setLink(data.link);
                setImages(data.images || []);
            } catch (error) {
                console.error("Error:", error);
                setImages(["/images/01_pd_focus_atlasconcorde.jpg"]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (images.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">

            {loading ? (
                <div className="h-screen flex items-center justify-center bg-gray-200 text-gray-600">
                    Loading...
                </div>
            ) : (
                <>
                    {images.map((image, idx) => (
                        <div
                            key={idx}
                            className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentIndex ? "opacity-100" : "opacity-0"
                                }`}
                        >
                            <Image src={image} fill alt="" className="object-cover" />
                        </div>
                    ))}

                    {/* Overlay Content */}
                    <div className="absolute inset-0 bg-black/30 z-10 flex flex-col items-center justify-center text-white text-center px-4">
                        <h1 className="text-6xl md:text-7xl font-bold mb-2">
                            {collectionName}
                        </h1>
                        <h2 className="text-3xl md:text-4xl font-light mb-8">
                            {brandName}
                        </h2>

                        <a href={link} target="_blank" rel="noopener noreferrer">
                            <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-orange-100 transition">
                                Take a Look Here
                            </button>
                        </a>
                    </div>

                    {/* Indicator */}
                    {images.length > 1 && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {images.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    className={`w-3 h-3 rounded-full transition ${index === currentIndex ? "bg-white w-8" : "bg-white/50"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
