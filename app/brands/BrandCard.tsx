'use client';
import Link from 'next/link';

interface BrandCardProps {
    imageSrc: string;
    redirectUrl: string;
    brandName?: string;
}

export default function BrandCard({
    imageSrc,
    redirectUrl,
    brandName = 'Brand Name',
}: BrandCardProps) {
    return (
        <Link href={redirectUrl} target="_blank" rel="noopener noreferrer">
            <div
                className="
          h-52 rounded-xl overflow-hidden
          bg-white shadow-md border-2 border-gray-300
          hover:border-[#ff5900] hover:shadow-[0_0_15px_rgba(255,89,0,0.7)]
          hover:scale-105 transform transition duration-300 cursor-pointer
          flex flex-col
        "
            >
                {/* Image filling top 2/3 with gradient bg */}
                <div
                    className="
            relative h-2/3 w-full p-4
            bg-gradient-to-tr from-gray-100 via-gray-50 to-white
            flex items-center justify-center
          "
                >
                    <img
                        src={imageSrc}
                        alt={brandName}
                        className={`object-contain max-h-full max-w-full ${imageSrc.endsWith('.svg') ? 'filter brightness-0 invert-0' : ''
                            }`}
                    />
                </div>

                {/* Bottom section with brand name and arrow */}
                <div
                    className="
            h-1/3 bg-gray-800 text-white
            flex items-center justify-center gap-2 px-6
            font-semibold text-sm tracking-wide
            select-none
          "
                >
                    <span>{brandName}</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-[#ff5900]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
