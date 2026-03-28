'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { LibraryBig } from "lucide-react";
import Link from 'next/link';

interface Collection {
    collection_id: number;
    collection_name: string;
    type: string;
    brand_name: string;
    material_type: string;
    status: boolean;
    description: string;
    image: string;
    link: string;
    relate_link: string;
}

interface ProjectDetailAPI {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: string;
    project_images: string[];
    collections: Collection[];
}

function ProjectDetailContent() {
    const searchParams = useSearchParams();
    const projectId = searchParams.get("id");

    const [project, setProject] = useState<ProjectDetailAPI | null>(null);
    const [current, setCurrent] = useState(0);
    const [carouselIndex, setCarouselIndex] = useState(0);

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleCollectionClick = (c: Collection) => {
        const linkToOpen = c.status ? c.link : c.relate_link;
        openExternalLink(linkToOpen);
    };


    useEffect(() => {
        if (!projectId) return;

        const fetchProjectDetail = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/projectdetail?id=${projectId}`);
                const data: ProjectDetailAPI[] = await res.json();
                setProject(data[0]);
            } catch (err) {
                console.error("Error fetching project detail:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjectDetail();
    }, [projectId]);

    useEffect(() => {
        if (!project) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % project.project_images.length);
        }, 3500);
        return () => clearInterval(timer);
    }, [project]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (!project) {
        return (
            <div className="bg-[#4a4a4a] min-h-screen text-white flex items-center justify-center">
                <p className="text-xl">Loading project...</p>
            </div>
        );
    }

    const uniqueTypes = Array.from(new Set(project.collections.map(c => c.material_type))).sort();
    const filteredCollections = selectedType ? project.collections.filter(c => c.material_type === selectedType) : project.collections;

    const nextSlide = () => setCurrent((current + 1) % project.project_images.length);
    const prevSlide = () => setCurrent((current - 1 + project.project_images.length) % project.project_images.length);

    const totalCarouselPages = Math.ceil(project.collections.length / 4);
    const carouselItems = project.collections.slice(carouselIndex * 4, carouselIndex * 4 + 4);

    const getPrevIndex = () => (current - 1 + project.project_images.length) % project.project_images.length;
    const getNextIndex = () => (current + 1) % project.project_images.length;
    const openExternalLink = (url: string) => {
        if (!url) return;

        const finalUrl =
            url.startsWith("http://") || url.startsWith("https://")
                ? url
                : `https://${url}`;

        window.open(finalUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <div className="bg-[#4a4a4a] min-h-screen text-white overflow-x-hidden">

            <header className="flex items-center justify-between px-8 py-4 bg-transparent">
                <Link href="/projects">
                    <button className="bg-white text-black font-semibold px-6 py-2 rounded-full shadow-md hover:bg-gray-100 transition">
                        Back to Project
                    </button>
                </Link>
            </header>

            <section className="px-12 pt-16 pb-10">
                <h1 className="text-6xl font-extrabold mb-2">About Project</h1>
                <h2 className="text-3xl font-semibold mb-2">{project.project_name}</h2>
                <p className="text-gray-300">Updated : {formatDate(project.data_update)}</p>
            </section>

            {/* SLIDER */}
            <div className="px-8 mb-12">
                <div className="relative max-w-7xl mx-auto">
                    <div className="flex items-center justify-center gap-4">

                        <div className="w-1/4 h-64 rounded-lg overflow-hidden opacity-50 cursor-pointer transition-all hover:opacity-70" onClick={prevSlide}>
                            <img src={project.project_images[getPrevIndex()]} className="w-full h-full object-cover" />
                        </div>

                        <div className="relative w-2/4 h-96 rounded-2xl overflow-hidden shadow-2xl group">
                            {project.project_images.map((img, i) => (
                                <img key={i} src={img} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`} />
                            ))}
                        </div>

                        <div className="w-1/4 h-64 rounded-lg overflow-hidden opacity-50 cursor-pointer transition-all hover:opacity-70" onClick={nextSlide}>
                            <img src={project.project_images[getNextIndex()]} className="w-full h-full object-cover" />
                        </div>

                    </div>
                </div>
            </div>

            {/* CAROUSEL */}
            <div className="text-center mb-10">
                <h3 className="text-xl mb-4">Take a look here</h3>

                <div className="flex justify-center gap-4 mb-4">
                    {carouselItems.map(c => (
                        <div
                            key={c.collection_id}
                            onClick={() => handleCollectionClick(c)}
                            className="relative w-32 h-20 rounded-lg overflow-hidden shadow-md cursor-pointer group hover:scale-105 transition"
                            style={{
                                backgroundImage: `url(${c.image})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center"
                            }}
                        >
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition"></div>
                            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-semibold px-2 text-center">
                                {c.collection_name}
                            </span>
                        </div>
                    ))}
                </div>

                {totalCarouselPages > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: totalCarouselPages }).map((_, i) => (
                            <button key={i} onClick={() => setCarouselIndex(i)} className={`w-3 h-3 rounded-full border-2 border-orange-500 ${i === carouselIndex ? 'bg-orange-500' : ''}`} />
                        ))}
                    </div>
                )}
            </div>

            {/* TABLE */}
            <div className="bg-[#3a3a3a] rounded-2xl p-6 mx-8 mb-8 overflow-hidden">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="flex items-center gap-2 text-xl font-semibold">
                        <LibraryBig className="text-orange-500 w-6 h-6" />
                        Product Overview
                    </h2>

                    <div className="relative">
                        <button onClick={() => setDropdownOpen(!dropdownOpen)} className="px-4 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition">
                            {selectedType || "Select Type"}
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-10">
                                <button className="block w-full px-4 py-2 hover:bg-orange-100" onClick={() => { setSelectedType(null); setDropdownOpen(false); }}>
                                    All Type
                                </button>
                                {uniqueTypes.map(t => (
                                    <button key={t} className="block w-full px-4 py-2 hover:bg-orange-100" onClick={() => { setSelectedType(t); setDropdownOpen(false); }}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead>
                        <tr className="border-b border-gray-600">
                            <th className="px-4 py-2">Collection Name</th>
                            <th className="px-4 py-2">Item</th>
                            <th className="px-4 py-2">Brand</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Status</th>
                            <th className="px-4 py-2 w-1/3">Description</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCollections.map(c => (
                            <tr
                                key={c.collection_id}
                                onClick={() => handleCollectionClick(c)}
                                className="border-b border-gray-700 hover:bg-gray-700 cursor-pointer transition"
                            >
                                <td className="px-4 py-2">{c.collection_name}</td>
                                <td className="px-4 py-2">{c.material_type}</td>
                                <td className="px-4 py-2">{c.brand_name}</td>
                                <td className="px-4 py-2">{c.type}</td>
                                <td className="px-4 py-2">{c.status ? "Available" : "Discontinued"}</td>
                                <td className="px-4 py-2 text-gray-300">{c.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default function ProjectDetail() {
    return (
        <Suspense fallback={
            <div className="bg-[#4a4a4a] min-h-screen text-white flex items-center justify-center">
                <p className="text-xl">Loading project...</p>
            </div>
        }>
            <ProjectDetailContent />
        </Suspense>
    );
}