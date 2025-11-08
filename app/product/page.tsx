import ProductHeroSlider from "./Components/ProductHeroSlider";
import ProductGallery from "./Components/ProductGallery";
import Image from "next/image";

export default function Product() {
    return (
        <div>
            <ProductHeroSlider />

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

            <ProductGallery />
        </div>
    );
}
