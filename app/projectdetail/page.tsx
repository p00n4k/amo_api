import { Suspense } from "react";
import ProjectDetailClient from "./ProjectDetailClient";

export const dynamic = "force-dynamic"; // กันพยายาม prerender/export หน้า query param

export default async function ProjectDetailPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;

    return (
        <Suspense
            fallback={
                <div className="bg-[#4a4a4a] min-h-screen text-white flex items-center justify-center">
                    <p className="text-xl">Loading project...</p>
                </div>
            }
        >
            <ProjectDetailClient projectId={id ?? null} />
        </Suspense>
    );
}
