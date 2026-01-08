"use client";

import { useState, useEffect } from "react";
import BrandCard from "./BrandCard"; // Adjust this path based on where BrandCard is saved

// Types
interface Brand {
    brand_id: number;
    brand_name: string;
    main_type: string;
    type: string;
    image: string;
    brand_url?: string;
}

type MainType = "Surface" | "Furnishing" | "Other";

export default function BrandsSearchPage() {
    const [activeMainType, setActiveMainType] = useState<MainType>("Surface");
    const [activeType, setActiveType] = useState<string>("ALL");
    const [brands, setBrands] = useState<Brand[]>([]);
    const [types, setTypes] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Load when main type or type changes
    useEffect(() => {
        fetchTypes();
        fetchBrands();
    }, [activeMainType, activeType]);

    // ========================================
    // Load Types by main_type
    // ========================================
    const fetchTypes = async () => {
        let endpoint = "";

        if (activeMainType === "Surface") {
            endpoint = "/api/typesurface";
        } else if (activeMainType === "Furnishing") {
            endpoint = "/api/typefurnishing";
        } else {
            endpoint = "/api/typeother";
        }

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            setTypes(data.types || []);
        } catch (error) {
            console.error("Error fetching types:", error);
        }
    };

    // ========================================
    // Load Brands by main_type + type
    // ========================================
    const fetchBrands = async () => {
        setLoading(true);

        let endpoint = "";

        if (activeMainType === "Surface") {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandsurfaceall"
                    : `/api/brandsurface?type=${activeType}`;
        } else if (activeMainType === "Furnishing") {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandfurnishingall"
                    : `/api/brandfurnishing?type=${activeType}`;
        } else {
            endpoint =
                activeType === "ALL"
                    ? "/api/brandotherall"
                    : `/api/brandother?type=${activeType}`;
        }

        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            setBrands(data.brands || []);
        } catch (error) {
            console.error("Error fetching brands:", error);
        }

        setLoading(false);
    };

    // Search filter
    const filteredBrands = brands.filter((brand) => {
        const name = brand.brand_name?.toLowerCase() ?? "";
        const type = brand.type?.toLowerCase() ?? "";
        const term = searchTerm.toLowerCase();

        return name.includes(term) || type.includes(term);
    });

    return (
        <div className="bg-[#3A3A3A] text-white min-h-screen">

            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 bg-[#2E2E2E]">
                <button
                    onClick={() => window.history.back()}
                    className="bg-[#F5F5F5] text-black px-4 py-2 rounded-md text-sm hover:bg-gray-200 transition"
                >
                    ← Back
                </button>
                <h1 className="font-bold text-lg">Brands</h1>
            </header>

            {/* Main Type Tabs */}
            <div className="flex justify-center space-x-8 border-b border-gray-600 px-6 mt-4">
                {["Surface", "Furnishing", "Other"].map((type) => (
                    <button
                        key={type}
                        onClick={() => {
                            setActiveMainType(type as MainType);
                            setActiveType("ALL");
                        }}
                        className={`pb-2 border-b-2 transition-colors ${activeMainType === type
                            ? "border-white font-semibold"
                            : "border-transparent text-gray-400 hover:text-white"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Type Filter */}
            <div className="flex justify-center flex-wrap gap-3 mt-6 px-6">
                <button
                    onClick={() => setActiveType("ALL")}
                    className={`px-4 py-2 rounded-md ${activeType === "ALL"
                        ? "bg-[#FF7A00] text-white"
                        : "bg-white text-black hover:bg-gray-200"
                        }`}
                >
                    ALL
                </button>
                {types.map((type) => (
                    <button
                        key={type}
                        onClick={() => setActiveType(type)}
                        className={`px-4 py-2 rounded-md ${activeType === type
                            ? "bg-[#FF7A00] text-white"
                            : "bg-white text-black hover:bg-gray-200"
                            }`}
                    >
                        {type.toUpperCase()}
                    </button>
                ))}
            </div>

            {/* Search Bar */}
            <div className="px-6 mt-6">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search brands or types..."
                    className="w-full max-w-md mx-auto block bg-[#2E2E2E] border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400"
                />
            </div>

            {/* Brand Cards */}
            <div className="px-6 mt-6 pb-12">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-12 w-12 border-b-2 border-white rounded-full"></div>
                    </div>
                ) : filteredBrands.length === 0 ? (
                    <p className="text-center py-20 text-gray-400">No brands found</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredBrands.map((brand) => (
                            <BrandCard
                                key={brand.brand_id}
                                imageSrc={brand.image}
                                redirectUrl={brand.brand_url || "#"}
                                brandName={brand.brand_name}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}