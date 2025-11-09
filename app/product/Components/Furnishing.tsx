'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FurnishingItem {
    item_id: number;
    image: string;
    link: string;
}

const Furnishing = () => {
    const [furnishItems, setFurnishingItems] = useState<FurnishingItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFurnishingItems();
    }, []);

    const fetchFurnishingItems = async () => {
        try {
            const response = await fetch('/api/productfurnish', { cache: 'no-store' });
            const data = await response.json();
            setFurnishingItems(data);
        } catch (error) {
            console.error('Error fetching furnish items:', error);
        } finally {
            setLoading(false);
        }
    };

    const bigCard = furnishItems[0];
    const smallCards = furnishItems.slice(1, 5);

    return (
        <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Furnishing</h2>
            <div className="grid grid-cols-3 gap-6">

                {/* ✅ Left 2x2 Small Cards (all link to /brands) */}
                <div className="grid grid-cols-2 grid-rows-2 gap-6 col-span-2">
                    {loading ? (
                        Array(4).fill(0).map((_, idx) => (
                            <div key={idx} className="bg-white/5 rounded-xl animate-pulse aspect-square" />
                        ))
                    ) : smallCards.length > 0 ? (
                        smallCards.map((item) => (
                            <Link
                                key={item.item_id}
                                href="/brands"  // ✅ Force /brands
                                className="relative bg-white/5 rounded-xl overflow-hidden group cursor-pointer"
                            >
                                <Image
                                    src={item.image}
                                    alt="Furnishing Item"
                                    width={500}
                                    height={500}
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                                <div className="absolute top-2 right-2 bg-white/20 rounded-full p-1 group-hover:scale-105 transition">
                                    <span className="text-white text-xl">↗</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>No Furnishing Items Found.</p>
                    )}
                </div>

                {/* ✅ Right Big Card (also link to /brands) */}
                <div className="relative rounded-3xl overflow-hidden group h-full">
                    {bigCard ? (
                        <>
                            <Image
                                src={bigCard.image}
                                alt="Furnishing Feature"
                                width={1000}
                                height={1000}
                                className="object-cover w-full h-full"
                            />

                            <Link href="/brands" className="absolute bottom-6 left-6">
                                <div className="bg-white/20 text-white text-xl px-6 py-3 rounded-full backdrop-blur-sm flex items-center justify-between w-[220px] cursor-pointer hover:bg-white/30 transition">
                                    Furnishing <span className="ml-2 text-white">↗</span>
                                </div>
                            </Link>
                        </>
                    ) : (
                        <div className="bg-gray-300 animate-pulse w-full h-full rounded-3xl" />
                    )}
                </div>

            </div>
        </div>
    );
};

export default Furnishing;
