// Create this as a separate component file: components/ui/CustomDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type Option = {
  id: string | number;
  name: string;
};

export default function CustomDropdown({ 
  options, 
  value, 
  onChange, 
  className = "" 
}: { 
  options: Option[]; 
  value: string | number; 
  onChange: (id: string | number) => void; 
  className?: string; 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find selected option
  const selectedOption = options.find(option => option.id === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.id);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected option display */}
      <div 
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-gray-800">{selectedOption.name}</span>
        <ChevronDown 
          className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </div>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="py-1">
            {options.map((option) => (
              <div
                key={option.id}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  option.id === selectedOption.id ? "bg-blue-100 font-medium text-blue-600" : "text-gray-700"
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}