"use client";

import { useEffect, useState } from "react";

interface Project {
    project_id: number;
    project_name: string;
    data_update: string;
    project_category: string;
}

export default function LastProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("http://localhost:3000/api/lastproject");
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
        return date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-gray-600 p-8 max-w mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto p-6 rounded-lg">
                {loading ? (
                    [...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="bg-white rounded-xl shadow-md overflow-hidden flex animate-pulse"
                        >
                            <div className="w-1/2 bg-gray-300 h-48"></div>
                            <div className="w-1/2 p-5 bg-neutral-100 space-y-3">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-3 bg-gray-300 rounded w-full"></div>
                            </div>
                        </div>
                    ))
                ) : projects.length > 0 ? (
                    projects.map((project) => (
                        <div
                            key={project.project_id}
                            className="bg-white rounded-xl shadow-md overflow-hidden flex hover:shadow-lg transition-shadow cursor-pointer"
                        >
                            <div className="w-1/2 relative">
                                <img
                                    src="/images/01_pd_focus_atlasconcorde.jpg"
                                    alt={project.project_name}
                                    className="object-cover h-full w-full"
                                />
                            </div>

                            <div className="w-1/2 p-5 bg-neutral-100">
                                <div className="mb-4">
                                    <div className="flex items-center space-x-2 text-sm text-gray-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-black"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                            />
                                        </svg>
                                        <span className="font-medium">{project.project_name}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(project.data_update)}
                                    </p>
                                </div>
                                <div className="text-sm space-y-2">
                                    <div>
                                        <p className="font-semibold text-gray-700">Category</p>
                                        <p className="text-gray-500">{project.project_category}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center text-white py-10">
                        <p className="text-xl">No projects available</p>
                    </div>
                )}
            </div>
        </div>
    );
}
