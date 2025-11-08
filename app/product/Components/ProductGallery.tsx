
'use client'
import { useState } from 'react'
import Surface from './Surface'
import Furnishing from './Furnishing'

const ProductGallery = () => {
    const [selectedTab, setSelectedTab] = useState<'surface' | 'furnishing'>('surface')

    return (
        <div className="bg-[#3a3a3a] min-h-screen px-6 py-12 text-white">
            {/* Tabs */}
            <div className="flex justify-center space-x-10 text-lg font-light mb-8 border-b border-white/20">
                <button
                    onClick={() => setSelectedTab('surface')}
                    className={`pb-2 ${selectedTab === 'surface' ? 'border-b-4 border-white font-semibold' : ''}`}
                >
                    Surface
                </button>
                <button
                    onClick={() => setSelectedTab('furnishing')}
                    className={`pb-2 ${selectedTab === 'furnishing' ? 'border-b-4 border-white font-semibold' : ''}`}
                >
                    Furnishing
                </button>
            </div>

            {/* Section */}
            {selectedTab === 'surface' ? <Surface /> : <Furnishing />}
        </div>
    )
}

export default ProductGallery
