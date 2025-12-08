// components/DistrictMap.js
'use client';

import React, { useState, useEffect } from 'react';
import { districtData } from '@/lib/districtData';

const DistrictMap = ({ correctGuesses, onDistrictHover, highlightedDistrict }) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [nepalMap, setNepalMap] = useState(null);

  useEffect(() => {
    // Load the main Nepal outline SVG
    import('/public/nepal-outline.svg').then(svg => {
      setNepalMap(svg.default);
      setMapLoaded(true);
    });
  }, []);

  // This approach creates a dynamic map with individual district SVGs
  // Each district SVG will have its own layer that can be manipulated
  return (
    <div className="district-map-container">
      {mapLoaded ? (
        <>
          {/* Base Nepal Map Outline */}
          <img 
            src={nepalMap.src} 
            alt="Nepal Map Outline" 
            className="w-full h-full absolute top-0 left-0"
          />
          
          {/* District Overlays */}
          {districtData.map(district => (
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

// Individual district SVG component with dynamic import
const DistrictSVG = ({ id, path, isCorrect, isHighlighted }) => {
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    // Dynamically import the district SVG
    const importSVG = async () => {
      try {
        const module = await import(`/public${path}`);
        setSvg(module.default);
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
    <img 
      src={svg.src} 
      alt={`District of ${id}`}
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