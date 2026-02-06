"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProductFocusItem {
  focus_id?: number;
  collection_name: string;
  brand_name: string;
  brand_image: string;
  description: string;
  made_in: string;
  type: string;
  link: string;
  images: string[];
}

type ActiveType = "surface" | "furnishing";

const MIN_CARDS = 5;

export default function SignatureCollections() {
  const [items, setItems] = useState<ProductFocusItem[]>([]);
  const [activeType, setActiveType] = useState<ActiveType>("surface");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const scrollEndTimer = useRef<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/productfocushomepage/${activeType}`, {
          cache: "no-store",
        });
        const json = await res.json();
        setItems(Array.isArray(json) ? json : []);
        setActiveIndex(0);
        setIsInitialized(false);
      } catch (e) {
        console.error(e);
        setItems([]);
        setActiveIndex(0);
        setIsInitialized(false);
      }
    };
    fetchData();
  }, [activeType]);

  // ensure at least 5 cards and create infinite loop by duplicating items
  const loopItems = useMemo(() => {
    if (items.length === 0) return [];

    let baseItems = items;
    if (items.length < MIN_CARDS) {
      const out: ProductFocusItem[] = [];
      let i = 0;
      while (out.length < MIN_CARDS) {
        out.push(items[i % items.length]);
        i++;
      }
      baseItems = out;
    }

    // Create infinite loop: add copies before and after
    return [...baseItems, ...baseItems, ...baseItems];
  }, [items]);

  const total = items.length >= MIN_CARDS ? items.length : MIN_CARDS;
  const startIndex = total; // Start at the middle set

  const activeItem = useMemo(() => {
    if (!total || loopItems.length === 0) return null;
    const actualIndex = ((activeIndex % total) + total) % total;
    const baseItems = items.length >= MIN_CARDS ? items : loopItems.slice(0, total);
    return baseItems[actualIndex];
  }, [loopItems, activeIndex, total, items]);

  /**
   * ✅ IMPORTANT FIX:
   * Replace scrollIntoView() (can scroll the whole page vertically)
   * with slider.scrollTo({ left }) (only horizontal movement)
   */
  const scrollToIndex = (index: number, smooth: boolean = true) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const child = slider.children[index] as HTMLElement | undefined;
    if (!child) return;

    // center the card horizontally inside the slider
    const targetLeft =
      child.offsetLeft - (slider.clientWidth / 2 - child.clientWidth / 2);

    slider.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  // Jump (no animation) to an index without visible "snap"
  const jumpToIndex = (index: number) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const prev = slider.style.scrollBehavior;
    slider.style.scrollBehavior = "auto";

    scrollToIndex(index, false);

    requestAnimationFrame(() => {
      slider.style.scrollBehavior = prev || "smooth";
    });
  };

  const go = (direction: number) => {
    if (!total) return;
    const newIndex = activeIndex + direction;
    setActiveIndex(newIndex);
    requestAnimationFrame(() => scrollToIndex(newIndex, true));
  };

  // Initialize to middle set on first load
  useEffect(() => {
    if (loopItems.length > 0 && !isInitialized) {
      setActiveIndex(startIndex);
      setIsInitialized(true);
      requestAnimationFrame(() => jumpToIndex(startIndex));
    }
  }, [loopItems.length, isInitialized, startIndex]);

  // Smooth infinite loop repositioning: wait until scroll ends, then jump (no animation)
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !total || !isInitialized) return;

    const handleRepositionIfNeeded = () => {
      // If we've scrolled past the end of the middle set, jump back into middle set
      if (activeIndex >= startIndex + total) {
        const fixed = startIndex + (activeIndex % total);
        setActiveIndex(fixed);
        jumpToIndex(fixed);
      }
      // If we've scrolled before the beginning of the middle set, jump to end of middle set
      else if (activeIndex < startIndex) {
        const fixed = startIndex + total - 1 - ((startIndex - activeIndex - 1) % total);
        setActiveIndex(fixed);
        jumpToIndex(fixed);
      }
    };

    const onScroll = () => {
      if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
      scrollEndTimer.current = window.setTimeout(handleRepositionIfNeeded, 120);
    };

    const onScrollEnd = () => handleRepositionIfNeeded();

    slider.addEventListener("scroll", onScroll, { passive: true });
    // @ts-ignore
    slider.addEventListener?.("scrollend", onScrollEnd);

    return () => {
      slider.removeEventListener("scroll", onScroll);
      // @ts-ignore
      slider.removeEventListener?.("scrollend", onScrollEnd);
      if (scrollEndTimer.current) window.clearTimeout(scrollEndTimer.current);
    };
  }, [activeIndex, total, startIndex, isInitialized]);

  if (!total || !activeItem) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <section className="bg-[#f8f8f8] py-16 px-6 font-[Poppins,sans-serif]">
      <div className="max-w-[1400px] mx-auto">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12 md:mb-16">
          <h2 className="text-4xl font-bold text-gray-900 text-center md:text-left">
            Signature <span className="italic font-medium text-gray-700">Collections</span>
          </h2>

          <div className="flex justify-center md:justify-end mt-6 md:mt-0 gap-3">
            <button
              onClick={() => setActiveType("surface")}
              className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${
                activeType === "surface"
                  ? "bg-orange-400 text-white border-orange-400"
                  : "text-gray-700 border-gray-300 hover:border-orange-400"
              }`}
            >
              Surface
            </button>
            <button
              onClick={() => setActiveType("furnishing")}
              className={`px-5 py-2 rounded-full border text-sm transition-all duration-300 ${
                activeType === "furnishing"
                  ? "bg-orange-400 text-white border-orange-400"
                  : "text-gray-700 border-gray-300 hover:border-orange-400"
              }`}
            >
              Furnishing
            </button>
          </div>
        </div>

        {/* ===== CONTENT CARD ===== */}
        <div className="bg-white rounded-2xl p-10 md:p-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* --- Brand Info --- */}
            <div className="md:w-1/3">
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={activeItem.brand_image}
                  alt={activeItem.brand_name}
                  width={50}
                  height={50}
                  className="rounded-full border border-gray-200 object-contain bg-white"
                />
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {activeItem.brand_name?.toLowerCase() ?? ""}
                  </h3>
                  <p className="text-gray-500 text-sm">{activeItem.collection_name}</p>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-3">{activeItem.description}</p>

              <p className="text-gray-800 text-sm mb-6">
                <span className="font-semibold">Made in :</span> {activeItem.made_in}
              </p>

              <Link
                href={activeItem.link}
                target="_blank"
                className="inline-block text-orange-500 border border-orange-400 rounded-full px-5 py-2 text-sm hover:bg-orange-400 hover:text-white transition"
              >
                Visit Collection ↗
              </Link>

              <div className="flex gap-2 mt-8">
                <button
                  onClick={() => go(-1)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition"
                >
                  ←
                </button>
                <button
                  onClick={() => go(1)}
                  className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:border-orange-400 hover:text-orange-500 transition"
                >
                  →
                </button>
              </div>
            </div>

            {/* --- Image Slider --- */}
            <div className="md:w-2/3 relative rounded-3xl overflow-hidden bg-white">
              <div
                ref={sliderRef}
                className="flex items-center overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth pb-6 scrollbar-hide px-4"
              >
                {loopItems.map((item, i) => {
                  const isActive = i === activeIndex;
                  const cover = item.images?.[0] || "/uploads/admin/testimage.jpg";

                  return (
                    <div
                      key={`${item.focus_id ?? "x"}-${i}`}
                      onClick={() => {
                        setActiveIndex(i);
                        requestAnimationFrame(() => scrollToIndex(i, true));
                      }}
                      className={`relative snap-center cursor-pointer transition-all duration-700 ease-in-out ${
                        isActive ? "z-20 opacity-100" : "opacity-70 hover:opacity-90 z-10"
                      }`}
                      style={{
                        flex: isActive ? "0 0 60%" : "0 0 20%",
                        height: "480px",
                        borderRadius: "1.5rem",
                        transform: isActive ? "scale(1)" : "scale(0.95)",
                      }}
                    >
                      <Image
                        src={cover}
                        alt={`${item.collection_name}-${i}`}
                        width={1200}
                        height={900}
                        className="object-cover w-full h-full"
                        priority={isActive}
                      />

                      {/* small label */}
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="backdrop-blur-sm bg-white/70 rounded-xl px-3 py-2">
                          <p className="text-gray-900 text-sm font-semibold truncate">
                            {item.collection_name}
                          </p>
                          <p className="text-gray-600 text-xs truncate">{item.brand_name}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🧩 Hide Scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}
