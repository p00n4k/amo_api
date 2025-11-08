// ============================================
// 📁 File: components/Surface.tsx (Updated)
// ============================================
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FocusProduct {
    collection_id: number;
    image: string;
    brandname: string;
    type: string;
    collection_link: string;
}

const Surface = () => {
    const [focusProducts, setFocusProducts] = useState<FocusProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFocusProducts();
    }, []);

    const fetchFocusProducts = async () => {
        try {
            // เรียก API ใหม่ที่เฉพาะเจาะจง
            const response = await fetch('/api/products/focus/surface');
            const data = await response.json();
            setFocusProducts(data);
        } catch (error) {
            console.error('Error fetching focus products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Surface</h2>
            <div className="grid grid-cols-3 gap-6">
                {/* Left side 2x2 cards - Focus Products */}
                <div className="grid grid-cols-2 grid-rows-2 gap-6 col-span-2">
                    {loading ? (
                        Array(4).fill(0).map((_, idx) => (
                            <div key={idx} className="relative bg-white/5 rounded-xl overflow-hidden animate-pulse">
                                <div className="w-full h-full bg-gray-300 aspect-square"></div>
                            </div>
                        ))
                    ) : focusProducts.length > 0 ? (
                        focusProducts.map((product) => (
                            <Link
                                key={product.collection_id}
                                href={product.collection_link || '/productsearch'}
                                className="relative bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={product.image || '/images/surface.jpg'}
                                    alt={product.brandname || 'Surface'}
                                    width={500}
                                    height={500}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <p className="text-white font-medium text-sm">{product.brandname}</p>
                                    <p className="text-white/80 text-xs">{product.type}</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 group-hover:scale-105 transition">
                                    <span className="text-white text-xl">↗</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        ['/images/surface.jpg', '/images/surface.jpg', '/images/surface.jpg', '/images/surface.jpg']
                            .map((src, idx) => (
                                <div key={idx} className="relative bg-white/5 rounded-xl overflow-hidden group">
                                    <Image
                                        src={src}
                                        alt={`Surface ${idx + 1}`}
                                        width={500}
                                        height={500}
                                        className="object-cover w-full h-full"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 group-hover:scale-105 transition">
                                        <span className="text-white text-xl">↗</span>
                                    </div>
                                </div>
                            ))
                    )}
                </div>

                {/* Right side big card - Static */}
                <div className="relative rounded-3xl overflow-hidden group h-full">
                    <Image
                        src="/images/surface.jpg"
                        alt="Surface Feature"
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full"
                    />
                    <Link href="/productsearch">
                        <div className="absolute bottom-6 left-6 bg-white/20 text-white text-xl px-6 py-3 rounded-full backdrop-blur-sm flex items-center justify-between w-[220px] cursor-pointer hover:bg-white/30 transition">
                            Surface
                            <span className="ml-2 text-white">↗</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Surface;