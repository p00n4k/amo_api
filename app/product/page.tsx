
import ProductGallery from './Components/ProductGallery'
import Image from 'next/image'

export default function Product() {
    return (

        <div>
            <div className="relative w-full h-screen">
                {/* Background image */}
                <Image
                    src="/images/01_pd_focus_atlasconcorde.jpg" // ⬅️ Replace with your actual image name
                    alt="Living Room"
                    layout="fill"
                    objectFit="cover"
                    quality={100}
                    className="z-0"
                />

                {/* Overlay content */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center px-4 z-10">
                    <h1 className="text-6xl md:text-7xl font-bold mb-2">LOG</h1>
                    <h2 className="text-3xl md:text-4xl font-light mb-8">atlas concorde</h2>

                    <div className="flex gap-4">
                        <button className="bg-white text-orange-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-orange-100 transition">
                            Take a Look Here
                        </button>
                        <button className="bg-white/20 border border-white text-white px-6 py-2 rounded-full hover:bg-white/30 transition flex items-center gap-1">
                            Discover our products <span className="text-xl">↓</span>
                        </button>
                    </div>
                </div>
            </div>
            {/* Banner Section */}
            <div className="bg-[#3a3a3a] px-4 py-6 flex justify-center items-center">
                <div className="w-full max-w-7xl h-[150px] rounded-xl overflow-hidden shadow-lg relative">
                    <Image
                        src="/images/banner.png"
                        alt="Tile Banner"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
            {/* Banner End */}
            <ProductGallery />
        </div>
    )
}
