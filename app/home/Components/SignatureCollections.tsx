"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductFocus {
    collection_name: string;
    brand_name: string;
    brand_image: string;
    description: string;
    made_in: string;
    type: string;
    link: string;
    images: string[];
}

export default function SignatureCollections() {
    const [data, setData] = useState<ProductFocus | null>(null);
    const [activeType, setActiveType] = useState<"surface" | "furnishing">("surface");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/productfocus/${activeType}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error("Error fetching product focus:", error);
            }
        };
        fetchData();
    }, [activeType]);

    if (!data)
        return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <section className="bg-[#f8f8f8] py-16 px-6 font-[Poppins,sans-serif]">
            <div className="max-w-[1400px] mx-auto">
                {/* ===== HEADER ===== */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 text-center md:text-left">
                        Signature{" "}
                        <span className="italic font-medium text-gray-700">Collections</span>
                    </h2>

                    {/* Toggle Buttons */}
                    <div className="flex justify-center md:justify-end mt-6 md:mt-0 gap-3">
                        <button
                            onClick={() => setActiveType("surface")}
                            className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${activeType === "surface"
                                    ? "bg-orange-400 text-white border-orange-400 shadow-md"
                                    : "text-gray-700 border-gray-300 hover:border-orange-400"
                                }`}
                        >
                            Surface
                        </button>
                        <button
                            onClick={() => setActiveType("furnishing")}
                            className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${activeType === "furnishing"
                                    ? "bg-orange-400 text-white border-orange-400 shadow-md"
                                    : "text-gray-700 border-gray-300 hover:border-orange-400"
                                }`}
                        >
                            Furnishing
                        </button>
                    </div>
                </div>

                {/* ===== CONTENT CARD ===== */}
                <div className="bg-white rounded-2xl shadow-sm p-10 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* --- Brand Info --- */}
                        <div className="md:w-1/3">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    src={data.brand_image}
                                    alt={data.brand_name}
                                    width={50}
                                    height={50}
                                    className="rounded-full border border-gray-200"
                                />
                                <h3 className="text-2xl font-semibold text-gray-900">
                                    {data.brand_name.toLowerCase()}
                                </h3>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                {data.description}
                            </p>

                            <p className="text-gray-800 text-sm mb-6">
                                <span className="font-semibold">Made in :</span> {data.made_in}
                            </p>

                            <Link
                                href={data.link}
                                target="_blank"
                                className="inline-block text-orange-500 border border-orange-400 rounded-full px-5 py-2 text-sm hover:bg-orange-400 hover:text-white transition"
                            >
                                Visit Collection ↗
                            </Link>
                        </div>

                        {/* --- Image Gallery --- */}
                        <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.images.map((img, i) => (
                                <div
                                    key={i}
                                    className="relative rounded-2xl overflow-hidden group cursor-pointer"
                                >
                                    <Image
                                        src={img}
                                        alt={`${data.collection_name}-${i}`}
                                        width={500}
                                        height={500}
                                        className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Overlay for first image */}
                                    {i === 0 && (
                                        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white bg-black/30">
                                            <h3 className="text-5xl font-extrabold tracking-tight uppercase drop-shadow-md">
                                                {data.collection_name.split(" ")[0]}
                                            </h3>
                                            <div className="flex items-center gap-3">
                                                <Link
                                                    href={data.link}
                                                    target="_blank"
                                                    className="bg-white text-orange-500 text-sm font-medium px-5 py-2 rounded-full hover:bg-orange-500 hover:text-white transition"
                                                >
                                                    Take a Look Here
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
