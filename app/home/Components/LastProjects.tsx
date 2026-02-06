"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin } from "lucide-react";

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: string;
    cover_image: string;
}

export default function LastProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/lastproject");
                const data = await res.json();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching last projects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
    };

    return (
        <section className="min-h-screen bg-[#3A3A3A] py-12 px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="max-w-7xl mx-auto mb-16">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                    <div className="flex-1">
                        <h2 className="text-white text-sm md:text-base font-light mb-2 leading-relaxed max-w-md">
                            Let us craft a place where trust
                            <br />
                            and style come together
                        </h2>
                        <div className="flex items-center gap-4">
                            <p className="text-white/70 text-xs md:text-sm">
                                Making your home uniquely yours.
                            </p>
                            <Link href="/projects">
  <button className="bg-[#F7931E] hover:bg-[#fba63c] text-white rounded-full px-6 py-2 text-sm font-medium transition-all hover:scale-105">
    View more
  </button>
</Link>
                        </div>
                    </div>
                    <h1 className="text-[150px] leading-none font-bold text-white/10">
                        Project
                    </h1>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        [...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="bg-[#F6F0E8] rounded-3xl overflow-hidden shadow-lg animate-pulse"
                            >
                                <div className="flex flex-col sm:flex-row h-full">
                                    <div className="sm:w-1/2 bg-gray-200 h-64 sm:h-auto"></div>
                                    <div className="sm:w-1/2 p-6 space-y-4">
                                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : projects.length > 0 ? (
                        projects.map((project, index) => (
                            <Link
                                key={`${project.project_id}-${index}`}
                                href={`/projectdetail?id=${project.project_id}`}
                                className="block"
                            >
                                <div className="bg-[#F6F0E8] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
                                    <div className="flex flex-col sm:flex-row h-full">
                                        {/* Project Image */}
                                        <div className="sm:w-1/2 relative overflow-hidden h-64 sm:h-80">
                                            <img
                                                src={project.cover_image || "/uploads/default.jpg"}
                                                alt={project.project_name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Project Info */}
                                        <div className="sm:w-1/2 p-6 sm:p-8 bg-[#F6F0E8] flex flex-col justify-between relative">
                                            <div className="space-y-4">
                                                <div className="flex items-start gap-2">
                                                    <MapPin className="w-5 h-5 text-[#3A3A3A]/60 flex-shrink-0 mt-0.5" />
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-[#3A3A3A]">
                                                            {project.project_name}
                                                        </h3>
                                                        <p className="text-sm text-[#3A3A3A]/60">
                                                            {formatDate(project.data_update)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="pt-4 border-t border-[#3A3A3A]/10">
                                                    <p className="text-sm font-medium text-[#3A3A3A] mb-1">
                                                        Primary Material
                                                    </p>
                                                    <p className="text-sm text-[#3A3A3A]/70">
                                                        {project.project_category}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Pagination Dots */}
                                            <div className="flex gap-2 mt-6">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className={`h-1.5 rounded-full transition-all ${i === 0
                                                                ? "w-8 bg-[#F7931E]"
                                                                : "w-1.5 bg-[#3A3A3A]/30"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="col-span-2 text-center py-16">
                            <p className="text-white/60 text-lg">No projects available</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
