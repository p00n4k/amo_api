'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface SurfaceItem {
    item_id: number;
    image: string;
    link: string;
}

const Surface = () => {
    const [surfaceItems, setSurfaceItems] = useState<SurfaceItem[]>([]);
    const [loading, setLoading] = useState(true);

    // ✅ lock heights (taller)
    const SMALL_H = 'h-[320px] md:h-[420px] lg:h-[480px]';
    const BIG_H = 'h-[640px] md:h-[840px] lg:h-[1000px]';

    useEffect(() => {
        fetchSurfaceItems();
    }, []);

    const fetchSurfaceItems = async () => {
        try {
            const response = await fetch('/api/productsurface', { cache: 'no-store' });
            const data = await response.json();
            setSurfaceItems(data);
        } catch (error) {
            console.error('Error fetching surface items:', error);
        } finally {
            setLoading(false);
        }
    };

    const bigCard = surfaceItems[0];
    const smallCards = surfaceItems.slice(1, 5);

    const CardOverlay = () => (
        <>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300" />

            <div className="absolute top-3 right-3 bg-white/20 rounded-full px-3 py-1 text-white text-sm backdrop-blur-sm group-hover:scale-105 transition">
                ↗
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-300">
                <div className="bg-white/20 text-white text-sm md:text-base px-4 py-2 rounded-full backdrop-blur-sm">
                    View detail more
                </div>
            </div>
        </>
    );

    return (
        <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-semibold">Surface</h2>

  <Link
    href="/brands"
    className="
      bg-orange-500 text-white
      px-5 py-2 rounded-full text-lg font-bold
      hover:bg-orange-600
      transition-all duration-300
      shadow-md hover:shadow-lg
    "
  >
    View All Brands
  </Link>
</div>


            <div className="grid grid-cols-3 gap-6">
                {/* ✅ Left 2x2 Small Cards (LOCK HEIGHT + TALLER) */}
                <div className="grid grid-cols-2 grid-rows-2 gap-6 col-span-2">
                    {loading ? (
                        Array(4)
                            .fill(0)
                            .map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`bg-white/5 rounded-xl animate-pulse ${SMALL_H}`}
                                />
                            ))
                    ) : smallCards.length > 0 ? (
                        smallCards.map((item) => (
                            <Link
                                key={item.item_id}
                                href={item.link || '#'}
                                className={`relative bg-white/5 rounded-xl overflow-hidden group cursor-pointer ${SMALL_H}`}
                                aria-label="View detail more"
                            >
                                <Image
                                    src={item.image}
                                    alt="Surface Item"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                />
                                <CardOverlay />
                            </Link>
                        ))
                    ) : (
                        <p>No Surface Items Found.</p>
                    )}
                </div>

                {/* ✅ Right Big Card (LOCK HEIGHT + TALLER) */}
                <div className={`relative rounded-3xl overflow-hidden group ${BIG_H}`}>
                    {bigCard ? (
                        <Link
                            href={bigCard.link || '#'}
                            className="relative block w-full h-full"
                            aria-label="View detail more"
                        >
                            <Image
                                src={bigCard.image}
                                alt="Surface Feature"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 33vw"
                            />

                            <CardOverlay />

                            {/* Bottom label */}
                            
                        </Link>
                    ) : (
                        <div className="bg-gray-300 animate-pulse w-full h-full rounded-3xl" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Surface;
