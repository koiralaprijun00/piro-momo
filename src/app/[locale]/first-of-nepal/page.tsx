'use client';

import { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import { RiCircleLine } from 'react-icons/ri';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import AdSenseGoogle from '@/components/AdSenseGoogle'; // Import AdSense component
import FirstOfNepalQuiz from '@/components/FirstOfNepalQuiz';
import { useParams } from 'next/navigation';

// Add this new component for the floating image
const FloatingImage = ({ 
    imagePath, 
    name, 
    position 
}: { 
    imagePath: string; 
    name: string; 
    position: { x: number; y: number };
}) => (
    <div
        className="absolute z-50 shadow-lg pointer-events-none"
        style={{ left: position.x, top: position.y }}
    >
        <Image 
            src={imagePath}
            alt={name}
            width={256}
            height={256}
            className="w-64 h-64 object-cover rounded-lg border-2 border-black"
            onError={(e) => {
                // Next.js Image component onError is different, usually handled by setting src state.
                // For simplicity and to avoid complex state for a simple tooltip, I will use standard <img> but optimized? 
                // Actually if I use Next/Image, onError works differently.
                // And dealing with `onError` in `next/image` is tricky without state.
                // I will revert to standard <img> but suppress the lint warning.
                // The warning is just a warning.
            }}
        />
    </div>
);

interface FirstItem {
    id: string;
    category: string;
    name: string;
    year: string;
    description: string;
    imagePath: string;
}

export default function FirstsOfNepal() {
    const [searchTerm, setSearchTerm] = useState('');
    const gridRef = useRef<HTMLDivElement>(null);
    const params = useParams();

    // For UI translations
    const mainT = useTranslations('Translations');
    // For First of Nepal data
    const t = useTranslations('firstsOfNepal');
    
    // Quiz questions
    const quizQuestions = [
        {
            question: "Who was the first Prime Minister of Nepal?",
            options: [
                "Bhimsen Thapa",
                "Jung Bahadur Rana",
                "Bishweshwar Prasad Koirala",
                "Girija Prasad Koirala"
            ],
            correctAnswer: 0
        },
        {
            question: "What was the first national park established in Nepal?",
            options: [
                "Chitwan National Park",
                "Sagarmatha National Park",
                "Langtang National Park",
                "Bardiya National Park"
            ],
            correctAnswer: 0
        },
        {
            question: "Who was the first Nepali to climb Mount Everest?",
            options: [
                "Tenzing Norgay",
                "Ang Rita Sherpa",
                "Babu Chiri Sherpa",
                "Apa Sherpa"
            ],
            correctAnswer: 0
        },
        {
            question: "When was the first democratic election held in Nepal?",
            options: [
                "1959",
                "1991",
                "2008",
                "2017"
            ],
            correctAnswer: 0
        }
    ];

    // Get items from translations
    const itemKeys = Object.keys(t.raw('items'));
    
    const firstItems = itemKeys.map(key => ({
        id: key,
        category: t(`items.${key}.category`),
        name: t(`items.${key}.name`),
        year: t(`items.${key}.year`),
        description: t(`items.${key}.description`),
        imagePath: t(`items.${key}.imagePath`)
    }));

    // Filter using the translated items
    const filteredFirsts = firstItems.filter(
        (item) => {
            const matchesSearch = 
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        }
    );

    return (
        <div className="min-h-screen w-full">
            {/* Main layout with sidebars */}
            <div className="flex justify-center">
                {/* Left sidebar ad - hidden on mobile */}
                <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
                    <div className="w-[160px] h-[600px]">
                        <AdSenseGoogle
                            adSlot="6865219846" // Use your actual left sidebar ad slot ID
                            adFormat="vertical"
                            style={{ width: '160px', height: '400px' }}
                        />
                    </div>
                </div>
                
                {/* Main content */}
                <div className="flex-1 ">
                    <div className="container mx-auto px-4 py-16">
                        {/* Hero Header */}
                        <div className="mb-16 text-center">
                            <h1 className="inline text-5xl md:text-7xl font-bold bg-gradient-to-r from-red-600 to-blue-700 bg-clip-text text-transparent uppercase tracking-tight">
                                {mainT('firstofNepalTitle')}
                            </h1>
                            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                                {mainT('firstofNepalSubtitle')}
                            </p>
                        </div>

                        {/* Search Section */}
                        <div className="max-w-4xl mx-auto mb-16">
                            <div className="flex flex-col gap-4 items-center">
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder={mainT('searchPlaceholder')}
                                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-red-500 focus:ring focus:ring-red-200 focus:ring-opacity-50 focus:outline-none text-lg transition duration-200"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    {searchTerm && (
                                        <button
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setSearchTerm('')}
                                        >
                                        <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                {filteredFirsts.length === 0 ? (
                                    <span>{mainT('noResults')}</span>
                                ) : (
                                    <span>
                                        {mainT(searchTerm ? 'showingResultsFor' : 'showingResults', {
                                        count: filteredFirsts.length,
                                        searchTerm,
                                        })}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div 
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative"
                            ref={gridRef}
                        >
                            {filteredFirsts.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-[300px] flex flex-col"
                                >
                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="inline-block text-red-800 rounded-full text-sm font-medium">
                                                {item.year}
                                            </div>
                                            <div 
                                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 cursor-pointer relative"
                                            >
                                                <RiCircleLine size={20} />
                                            </div>
                                        </div>
                                        <div className="text-xl text-red-600 mb-4">
                                        {mainT('First')} {item.category}
                                        </div>
                                        <h2 className="text-2xl font-lora font-semibold text-gray-900 mb-1">
                                            {item.name}
                                        </h2>
                                        <p className="text-gray-600 leading-relaxed overflow-hidden text-ellipsis flex-grow">
                                            {item.description}
                                        </p>
                                        <div className="mt-6 flex gap-4">
                                            <Link
                                                href={`https://en.wikipedia.org/wiki/${encodeURIComponent(item.name)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Wikipedia
                                            </Link>
                                            <Link
                                                href={`https://www.google.com/search?q=${encodeURIComponent(item.name + ' ' + item.category + ' Nepal')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-gray-400 hover:text-blue-800 text-sm font-medium"
                                            >
                                                Google
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* No Results Message */}
                        {filteredFirsts.length === 0 && (
                            <div className="text-center py-16">
                                <div className="inline-flex justify-center items-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{mainT('noResults')}</h3>
                                <p className="text-gray-600 mb-6">{mainT('noMatches', { searchTerm })}</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    {mainT('clearSearch')}
                                </button>
                            </div>
                        )}
                        
                    </div>
                </div>
                
                {/* Right sidebar ad - hidden on mobile */}
                <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
                    <div className="w-[160px] h-[600px]">
                        <AdSenseGoogle 
                            adSlot="9978468343" // Use your actual right sidebar ad slot ID
                            adFormat="vertical"
                            style={{ width: '160px', height: '400px' }}
                        />
                    </div>
                </div>
            </div>
            
            {/* Add Quiz Component */}
            <FirstOfNepalQuiz locale={typeof params.locale === 'string' ? params.locale : 'en'} />
        </div>
    );
}
