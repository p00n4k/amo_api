"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link"; // ✅ เพิ่ม
import ProductGallery from "./ProductGallery";

export default function ProductPage() {
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const res = await fetch("/api/admin/productmain", { cache: "no-store" });
                const data = await res.json();
                const item = Array.isArray(data) ? data[0] : data;

                if (item) {
                    item.images = item.images?.map((img: any) => img.image_url) || [];
                    setProduct(item);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, []);

    // ✅ Auto Slide
    useEffect(() => {
        if (!product?.images || product.images.length < 2) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % product.images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [product]);

    if (loading) return <div className="w-full h-screen bg-gray-300 animate-pulse" />;

    return (
        <div>
            {/* ✅ Hero Slider */}
            <div className="relative w-full h-screen overflow-hidden">
                {product?.images?.map((img: string, index: number) => (
                    <Image
                        key={index}
                        src={img}
                        alt={product.collection_name}
                        fill
                        className={`object-cover absolute inset-0 transition-opacity duration-1000 ${
                            index === currentIndex ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4 z-10">
                    <h1 className="text-6xl md:text-7xl font-bold mb-2">
                        {product?.collection_name}
                    </h1>

                    <h2 className="text-3xl md:text-4xl font-light mb-8">
                        {product?.brand_name}
                    </h2>

                    <div className="flex gap-4">
                        <a
                            href={
                                product?.link
                                    ? product.link.startsWith("http://") ||
                                      product.link.startsWith("https://")
                                        ? product.link
                                        : `https://${product.link}`
                                    : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-200 transition"
                        >
                            Take a Look Here
                        </a>

                        <a
                            href="#product-gallery"
                            className="bg-white/20 border border-white text-white px-6 py-2 rounded-full hover:bg-white/30 transition flex items-center gap-1"
                        >
                            Discover our products <span className="text-xl">↓</span>
                        </a>
                    </div>
                </div>

                {/* Slide Controls */}
                {product?.images?.length > 1 && (
                    <>
                        <button
                            onClick={() =>
                                setCurrentIndex(
                                    (prev) =>
                                        (prev - 1 + product.images.length) %
                                        product.images.length
                                )
                            }
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl z-20 hover:text-gray-300"
                        >
                            ‹
                        </button>

                        <button
                            onClick={() =>
                                setCurrentIndex(
                                    (prev) => (prev + 1) % product.images.length
                                )
                            }
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl z-20 hover:text-gray-300"
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* ✅ Banner Section (เพิ่มปุ่ม Brands ด้านล่าง) */}
            <div className="bg-[#3a3a3a] px-4 py-6 flex justify-center items-center">
                <div className="w-full max-w-7xl h-[150px] rounded-xl overflow-hidden shadow-lg relative">
                    <Image
                        src="/static/banner.png"
                        alt="Tile Banner"
                        fill
                        className="object-cover"
                    />

                    {/* Gradient Overlay */}
                

                    {/* ✅ Brands Button */}
                    
                </div>
            </div>

            {/* Product Gallery */}
            <div id="product-gallery">
                <ProductGallery />
            </div>
        </div>
    );
}
