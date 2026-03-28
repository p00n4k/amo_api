'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Collection {
    collection_id: number;
    type: string;
    collection_name: string; // ← add this line
}

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: 'Residential' | 'Commercial';
    project_images: string[];
    collections: Collection[];
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
}

const tabs = ['Residential', 'Commercial'] as const;

const ProjectPage = () => {
    const [activeTab, setActiveTab] = useState<'Residential' | 'Commercial'>('Residential');
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    // ✅ Slider States
    const [sliderImages, setSliderImages] = useState<string[] | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    let touchStart = 0;

    const openSlider = (images: string[]) => {
        setSliderImages(images);
        setCurrentIndex(0);
    };

    const closeSlider = () => setSliderImages(null);

    const nextSlide = () => {
        if (!sliderImages) return;
        setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    };

    const prevSlide = () => {
        if (!sliderImages) return;
        setCurrentIndex((prev) =>
            prev === 0 ? sliderImages.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const fetchProjects = async () => {
            setLoading(true);

            const endpoint =
                activeTab === 'Residential'
                    ? `/api/projectresidence?page=${page}`
                    : `/api/projectcommercial?page=${page}`;

            try {
                const res = await fetch(endpoint);
                const data = await res.json();

                setProjects(data.projects || []);
                setPagination(data.pagination || null);
            } catch (err) {
                console.error('Error fetching projects:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [activeTab, page]);

    useEffect(() => {
        setPage(1);
    }, [activeTab]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="bg-[#2d2d2d] min-h-screen text-white px-4 py-8 pt-35">
            <p className="text-sm mb-4">
                We have a diverse body of work and utilize various materials.
            </p>

            {/* Tabs */}
            <div className="flex space-x-12 mb-8 border-b border-gray-600">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`pb-2 text-lg font-medium transition ${activeTab === tab
                            ? 'border-b-4 border-white text-white'
                            : 'text-gray-400 hover:text-gray-200'
                            }`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                    <span className="ml-4 text-lg">Loading projects...</span>
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <p className="text-xl">No projects found</p>
                </div>
            ) : (
                <>
                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                key={project.project_id}
                                className="bg-white text-black rounded-lg overflow-hidden shadow-md hover:shadow-xl transition cursor-pointer"
                            >
                                {/* ✅ CLICK TO OPEN SLIDER */}
                                <div
                                    className="relative h-60 bg-gray-200"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openSlider(project.project_images);
                                    }}
                                >
                                    <Image
                                        src={project.project_images[0] || '/images/sample_project/sample_project.png'}
                                        alt={project.project_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* ✅ CLICK BOTTOM TO NAVIGATE */}
                                <div
                                    className="p-4"
                                    onClick={() =>
                                        (window.location.href = `/projectdetail?id=${project.project_id}`)
                                    }
                                >
                                    <h2 className="text-lg font-semibold">{project.project_name}</h2>
                                    <p className="text-sm text-gray-500">{formatDate(project.data_update)}</p>

                                    {project.collections?.length > 0 && (
                                        <p className="text-sm text-gray-700 mt-2">
                                            <strong>Collections:</strong> {project.collections.map((c) => c.collection_name).join(', ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && (
                        <div className="flex justify-center items-center gap-4 mt-10">
                            <button
                                disabled={pagination.page <= 1}
                                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                className="px-4 py-2 border border-gray-400 rounded disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <span className="text-sm opacity-80">
                                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
                            </span>

                            <button
                                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                                onClick={() => setPage((prev) => prev + 1)}
                                className="px-4 py-2 border border-gray-400 rounded disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* ✅ FULLSCREEN SLIDER WITH ARROWS + SWIPE */}
            {sliderImages && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <button
                        onClick={closeSlider}
                        className="absolute top-6 right-6 text-white text-3xl font-light z-50"
                    >
                        ✕
                    </button>

                    <div
                        className="relative w-full max-w-5xl mx-auto overflow-hidden"
                        onTouchStart={(e) => (touchStart = e.changedTouches[0].clientX)}
                        onTouchEnd={(e) => {
                            const diff = e.changedTouches[0].clientX - touchStart;
                            if (diff > 50) prevSlide();
                            if (diff < -50) nextSlide();
                        }}
                    >
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {sliderImages.map((img, i) => (
                                <div key={i} className="min-w-full flex justify-center">
                                    <Image
                                        src={img}
                                        alt=""
                                        width={1600}
                                        height={1000}
                                        className="object-contain max-h-[90vh]"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Left Arrow */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-50 bg-black/40 rounded-full px-3 py-1 hover:bg-black/60 transition"
                        >
                            ‹
                        </button>

                        {/* Right Arrow */}
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-50 bg-black/40 rounded-full px-3 py-1 hover:bg-black/60 transition"
                        >
                            ›
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectPage;
