import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="bg-[#E8E5E0] text-white min-h-screen pt-35">
            {/* ===== HERO SECTION ===== */}
            <div className="bg-[#E8E5E0] text-center py-10 mt-0 ">
                <div className="flex justify-between max-w-6xl mx-auto items-start px-4">
                    {/* Left badge */}
                    <div className="bg-white border-t-[6px] border-[#F4C27A] shadow-md p-4 rounded-b-3xl w-32">
                        <div className="text-[#F4C27A] text-2xl font-bold">30+ Years</div>
                        <p className="text-gray-500 text-sm">of experience</p>
                    </div>

                    {/* Center title */}
                    <div>
                        <h1 className="text-6xl font-serif text-black">Amo</h1>
                        <p className="text-gray-700 mt-1 text-sm">
                            We are a group of experts <br /> in home decoration
                        </p>
                    </div>

                    {/* Right badge */}
                    <div className="bg-white border-t-[6px] border-[#F4C27A] shadow-md p-4 rounded-b-3xl w-32">
                        <div className="text-[#F4C27A] text-2xl font-bold">1000+</div>
                        <p className="text-gray-500 text-sm">Projects</p>
                    </div>
                </div>
            </div>

            {/* ===== CONTENT SECTION ===== */}
            <div className="bg-[#2D2D2D]">
                <div className="max-w-6xl mx-auto py-16 px-6  ">
                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        {/* Left side */}
                        <div className="space-y-8">
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src="/static/getintouch_1.png"
                                    alt="Interior 1"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>

                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src="/static/getintouch_2.png"
                                    alt="Interior 2"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>

                            <p className="text-sm leading-relaxed text-gray-200">
                                Amo Co.,Ltd. focuses on delivering the{" "}
                                <span className="font-bold text-white text-lg">
                                    HIGHEST QUALITY
                                </span>{" "}
                                of products and services to our customers as we have different
                                types of products for all design both modern and classic. Apart
                                from decoration and design, Amo is also a reliable counselor in
                                selecting goods of design that meet the clients requirements and
                                budget.
                            </p>
                        </div>

                        {/* Right side */}
                        <div className="space-y-10">
                            <div className="text-right">
                                <p className="text-gray-400 text-lg mb-2">Established in</p>
                                <h2 className="text-[#F4C27A] text-[120px] font-extrabold leading-none">
                                    2010
                                </h2>
                                <p className="text-gray-200 text-justify mt-4">
                                    by a group of experts in home decoration who has a comprehensive
                                    and deep knowledge in decoration materials, interior design and
                                    home items.
                                </p>
                            </div>

                            <div className="relative w-full aspect-[3/4]">
                                <Image
                                    src="/static/getintouch_3.png"
                                    alt="Interior 3"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== QUOTE SECTION ===== */}
                <div className="bg-[#4A4A4A] text-center py-16 px-6">
                    <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Since the establishment, Amo has catered in completing several
                        wonderful home renovation and decoration works. With a focus on
                        quality, function, and aesthetic appeal, we have continuously worked
                        to exceed expectations and guarantee both function and style for our
                        customers.
                    </p>

                    <h3 className="text-white font-semibold text-xl mt-10 leading-relaxed">
                        From the beginning to the end <br />
                        of your home renovation <br />
                        or decoration process,
                    </h3>
                    <p className="mt-4 text-gray-300 italic text-lg">
                        We can assure you the satisfaction <br />
                        with our <span className="text-white font-semibold">goods</span> and{" "}
                        <span className="text-white font-semibold">services</span>.
                    </p>
                </div>

                {/* ===== IMAGE FOOTER SECTION ===== */}
                <div className="p-6 ">
                    <div className="rounded-2xl overflow-hidden shadow-lg h-[200px] relative w-center max-w-6xl mx-auto">
                        <Image
                            src="/static/banner.png"
                            alt="Banner"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                {/* ===== MAP SECTION ===== */}
                <div className="bg-[#3A3A3A] py-10 px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="relative w-full aspect-[16/9]">
                            <Image
                                src="/static/map.png"
                                alt="Map location"
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>

                        <div className="text-center mt-8 text-sm text-gray-400">
                            <p>
                                Amo Co.,Ltd. | 33/1 Sukhumvit 26 Alley, Klongton, Khlong Toei,
                                Bangkok 10110
                            </p>
                            <p className="mt-2">
                                <span className="text-white font-medium">
                                    Consult with our best experts
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
