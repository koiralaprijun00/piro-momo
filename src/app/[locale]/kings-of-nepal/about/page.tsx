'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';
import AdSenseGoogle from '@/components/AdSenseGoogle';
import { BiArrowBack } from "react-icons/bi";
import Link from 'next/link';


export default function KingsOfNepalBlog() {
  const [activeKing, setActiveKing] = useState<string | null>(null);
  
  // Get all kings IDs in chronological order
  const kingsIds = [
    'prithvi_narayan_shah',
    'pratap_singh_shah',
    'rana_bahadur_shah',
    'girvan_yuddha_bikram_shah',
    'rajendra_bikram_shah',
    'surendra_bikram_shah',
    'prithvi_bir_bikram_shah',
    'tribhuvan_bir_bikram_shah',
    'mahendra_bir_bikram_shah',
    'birendra_bir_bikram_shah',
    'dipendra_bir_bikram_shah',
    'gyanendra_bir_bikram_shah'
  ];

  // Directly try/catch all translation calls to avoid errors
  let mainTranslations = {} as any;
  let kingTranslations = {} as any;
  
  try {
    const mainT = useTranslations('Translations');
    mainTranslations = {
      kingTitle: mainT('kingTitle'),
      kingSubHeading: mainT('kingofNepalSubHeading')
    };
  } catch (error) {
    console.warn('Error loading main translations');
    mainTranslations = {
      kingTitle: 'Kings of Nepal',
      kingSubHeading: 'Learn about the historical kings who ruled Nepal throughout its rich history.'
    };
  }
  
  try {
    const t = useTranslations('kingsofnepal');
    
    // Pre-load all king translations to prevent errors
    kingTranslations = kingsIds.reduce((acc, kingId) => {
      try {
        acc[kingId] = {
          title: t(`${kingId}.title`),
          reignYears: t(`${kingId}.reign_years`),
          description: t(`${kingId}.description`),
          image: t(`${kingId}.image`)
        };
      } catch (error) {
        console.warn(`Error loading translations for king: ${kingId}`);
        acc[kingId] = {
          title: `King ${kingId.replace(/_/g, ' ')}`,
          reignYears: 'Reign period not available',
          description: 'Description not available.',
          image: '/placeholder.jpg'
        };
      }
      return acc;
    }, {} as Record<string, any>);
  } catch (error) {
    console.warn('Error loading king translations');
    // Create fallback translations
    kingTranslations = kingsIds.reduce((acc, kingId, index) => {
      acc[kingId] = {
        title: `King ${kingId.replace(/_/g, ' ')}`,
        reignYears: 'Reign period not available',
        description: 'Description not available.',
        image: '/placeholder.jpg'
      };
      return acc;
    }, {} as Record<string, any>);
  }

  return (
    <div className="min-h-screen w-full">
      {/* Main layout with sidebars */}
      <div className="flex justify-center">
        {/* Left sidebar ad - hidden on mobile */}
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] ml-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle
              adSlot="6865219846"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 px-4 py-8">
          
          <div className="max-w-5xl mx-auto">
          <div className="inline-block">
          <Link
  href="/kings-of-nepal"
  className="flex items-center mb-4 text-sm bg-gradient-to-r from-blue-500 to-red-500 text-white px-4 py-2 rounded-full hover:bg-gradient-to-r hover:from-blue-600 hover:to-red-600 hover:scale-105 transition-all duration-200 origin-right"
>
  <BiArrowBack />
</Link>
</div>

            {/* Hero Section */}
            <div className="mb-12">
              <h1 className="inline text-4xl md:text-5xl font-bold text-left bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-red-500 mb-6">
                {mainTranslations.kingTitle}
              </h1>
              <div className="bg-white  mt-4 max-w-3xl mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  {mainTranslations.kingSubHeading}
                </p>
              </div>
            </div>
            
            {/* Kings List */}
            <div className="space-y-16">
              {kingsIds.map((kingId, index) => (
                <div 
                  key={kingId}
                  id={kingId}
                  className="scroll-mt-20"
                >
                  {/* King number indicator */}
                  <div className="flex items-center mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="h-0.5 flex-grow ml-4 bg-gradient-to-r from-blue-500 to-transparent"></div>
                  </div>
                  
                  {/* King Card - without stark border */}
                  <div className="bg-white  rounded-lg shadow-md overflow-hidden">
                    <div className="md:flex">
                      {/* Text Content - Left Side */}
                      <div className="p-6 md:w-1/2">
                        <h2 className="text-2xl font-bold text-gray-900  mb-3">
                          {kingTranslations[kingId]?.title}
                        </h2>
                        
                        <div className="mb-4">
                          <span className="inline-block bg-blue-100  text-blue-800  text-sm font-medium px-3 py-1 rounded-full">
                            {kingTranslations[kingId]?.reignYears}
                          </span>
                        </div>
                        
                        <div className="prose prose-blue max-w-none ">
                          <p className="text-gray-700 leading-relaxed">
                            {kingTranslations[kingId]?.description}
                          </p>
                        </div>
                      </div>
                      
                      {/* Image - Right Side */}
                      <div className="md:w-1/2 relative">
                        <div className="relative h-80 md:h-full">
                          <Image 
                            src={kingTranslations[kingId]?.image || '/placeholder.jpg'}
                            alt={kingTranslations[kingId]?.title || `King ${index+1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right sidebar ad - hidden on mobile */}
        <div className="hidden lg:block w-[160px] sticky top-24 self-start h-[600px] mr-4">
          <div className="w-[160px] h-[600px]">
            <AdSenseGoogle 
              adSlot="9978468343"
              adFormat="vertical"
              style={{ width: '160px', height: '400px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}