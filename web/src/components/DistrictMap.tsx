import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { districtData } from '@/app/data/district-data';
import { District } from '@/app/data/district-data';

interface DistrictMapProps {
  correctGuesses: string[];
  onDistrictHover: (id: string | null) => void;
  highlightedDistrict: string | null;
}

const DistrictMap: React.FC<DistrictMapProps> = ({ correctGuesses, onDistrictHover, highlightedDistrict }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nepalMap, setNepalMap] = useState<any>(null); // Type 'any' for imported svg default for now

  useEffect(() => {
    // Load the main Nepal outline SVG
    import('/public/nepal-outline.svg').then(svg => {
      setNepalMap(svg.default);
      setMapLoaded(true);
    });
  }, []);

  return (
    <div className="district-map-container">
      {mapLoaded ? (
        <>
          {/* Base Nepal Map Outline */}
          <Image
            src={nepalMap}
            alt="Nepal Map Outline"
            className="w-full h-full absolute top-0 left-0"
            width={800}
            height={500}
          />
          
          {/* District Overlays */}
          {districtData.map((district: District) => (
            <div
              key={district.id}
              className={`district-overlay ${
                correctGuesses.includes(district.id) ? 'opacity-100' : 'opacity-0 hover:opacity-50'
              }`}
              onMouseEnter={() => onDistrictHover(district.id)}
              onMouseLeave={() => onDistrictHover(null)}
            >
              <DistrictSVG 
                id={district.id}
                path={district.imagePath}
                isCorrect={correctGuesses.includes(district.id)}
                isHighlighted={highlightedDistrict === district.id}
              />
            </div>
          ))}
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-gray-500">Loading map...</div>
        </div>
      )}
    </div>
  );
};

interface DistrictSVGProps {
  id: string;
  path: string;
  isCorrect: boolean;
  isHighlighted: boolean;
}

// Individual district SVG component with dynamic import
const DistrictSVG: React.FC<DistrictSVGProps> = ({ id, path, isCorrect, isHighlighted }) => {
  const [svg, setSvg] = useState<any>(null);

  useEffect(() => {
    // Dynamically import the district SVG
    const importSVG = async () => {
      try {
        const svgModule = await import(`/public${path}`);
        setSvg(svgModule.default);
      } catch (error) {
        console.error(`Error loading SVG for district ${id}:`, error);
      }
    };

    importSVG();
  }, [id, path]);

  if (!svg) {
    return null;
  }

  return (
    <Image 
      src={svg}
      alt={`District of ${id}`}
      width={100}
      height={100}
      className={`district-svg ${
        isCorrect 
          ? 'district-correct' 
          : 'district-unguessed'
      } ${
        isHighlighted 
          ? 'district-highlighted' 
          : ''
      }`}
    />
  );
};

export default DistrictMap;
