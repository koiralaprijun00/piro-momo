'use client'

import { useState, useRef, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type SubmissionProps = {
  onCancel: () => void;
};

export default function LocationSubmissionForm({ onCancel }: SubmissionProps) {
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [funFact, setFunFact] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationMethod, setLocationMethod] = useState<'manual' | 'auto'>('manual');
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Added state for client-side rendering detection
  const [isClient, setIsClient] = useState(false);
  const [isGeolocationAvailable, setIsGeolocationAvailable] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Check if we're in the browser and set up geolocation only after component mounts
  useEffect(() => {
    setIsClient(true);
    setIsGeolocationAvailable('geolocation' in navigator);
  }, []);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.match('image.*')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: 'Image size should be less than 5MB' }));
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Clear error if exists
    if (errors.image) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.image;
        return newErrors;
      });
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!isGeolocationAvailable) {
      setErrors(prev => ({ ...prev, geolocation: 'Geolocation is not supported by your browser' }));
      return;
    }
    
    setIsGettingLocation(true);
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.geolocation;
      delete newErrors.lat;
      delete newErrors.lng;
      return newErrors;
    });
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setIsGettingLocation(false);
        setLocationMethod('auto');
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Failed to get your location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access was denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        setErrors(prev => ({ ...prev, geolocation: errorMessage }));
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) newErrors.name = 'Location name is required';
    
    if (!lat.trim()) {
      newErrors.lat = 'Latitude is required';
    } else {
      const latValue = parseFloat(lat);
      if (isNaN(latValue) || latValue < -90 || latValue > 90) {
        newErrors.lat = 'Latitude must be between -90 and 90';
      }
    }
    
    if (!lng.trim()) {
      newErrors.lng = 'Longitude is required';
    } else {
      const lngValue = parseFloat(lng);
      if (isNaN(lngValue) || lngValue < -180 || lngValue > 180) {
        newErrors.lng = 'Longitude must be between -180 and 180';
      }
    }
    
    if (!funFact.trim()) newErrors.funFact = 'Please provide a fun fact about this location';
    
    if (!imageFile) newErrors.image = 'Please upload an image of the location';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle switching location method
  const handleLocationMethodChange = (method: 'manual' | 'auto') => {
    setLocationMethod(method);
    if (method === 'auto') {
      getCurrentLocation();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    if (!validateForm()) return;
    setIsSubmitting(true);
  
    try {
      let imageUrl = '';
  
      // Upload the image first
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
  
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
  
        const uploadResult = await uploadResponse.json();
        console.log('Upload Response:', { status: uploadResponse.status, body: uploadResult });
  
        if (!uploadResponse.ok) {
          throw new Error(uploadResult.error || 'Failed to upload image');
        }
  
        imageUrl = uploadResult.imageUrl;
      }
  
      // Submit the location data
      const locationData = {
        name,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        imageUrl,
        funFact,
      };
  
      const response = await fetch('/api/geo-admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(locationData),
      });
  
      const responseData = await response.json();
      console.log('Location Submission Response:', { status: response.status, body: responseData });
  
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to submit location');
      }
  
      // Show success message and redirect
      alert('Location submitted successfully! It will be reviewed by our team.');
      router.push('/geo-nepal');
    } catch (error) {
      console.error('Error submitting location:', error);
      setErrors(prev => ({
        ...prev,
        submit: error instanceof Error ? error.message : 'Failed to submit location. Please try again.',
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      
      {errors.submit && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Location Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="e.g., Annapurna Base Camp"
            disabled={isSubmitting}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Location Coordinates *
          </label>
          
          {isClient && (
            <div className="bg-gray-50 p-3 rounded-md mb-3">
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                <button
                  type="button"
                  onClick={() => handleLocationMethodChange('manual')}
                  disabled={isSubmitting}
                  className={`flex-1 py-2 px-3 rounded-md transition ${
                    locationMethod === 'manual'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Enter Manually
                </button>
                
                <button
                  type="button"
                  onClick={() => handleLocationMethodChange('auto')}
                  disabled={!isGeolocationAvailable || isGettingLocation || isSubmitting}
                  className={`flex-1 py-2 px-3 rounded-md transition ${
                    locationMethod === 'auto'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${(!isGeolocationAvailable || isGettingLocation || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isGettingLocation ? 'Getting Location...' : 'Use My Current Location'}
                </button>
              </div>
              
              {errors.geolocation && (
                <p className="mt-2 text-sm text-red-500">{errors.geolocation}</p>
              )}
              
              {isClient && !isGeolocationAvailable && (
                <p className="mt-2 text-sm text-amber-600">
                  Geolocation is not supported by your browser. You'll need to enter coordinates manually.
                </p>
              )}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="lat" className="block text-gray-700 font-medium mb-2">
                Latitude *
              </label>
              <input
                type="text"
                id="lat"
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  if (isClient) setLocationMethod('manual');
                }}
                className={`w-full px-3 py-2 border rounded-md ${errors.lat ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., 28.5308"
                disabled={isSubmitting}
              />
              {errors.lat && <p className="mt-1 text-sm text-red-500">{errors.lat}</p>}
            </div>
            
            <div>
              <label htmlFor="lng" className="block text-gray-700 font-medium mb-2">
                Longitude *
              </label>
              <input
                type="text"
                id="lng"
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  if (isClient) setLocationMethod('manual');
                }}
                className={`w-full px-3 py-2 border rounded-md ${errors.lng ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="e.g., 83.8800"
                disabled={isSubmitting}
              />
              {errors.lng && <p className="mt-1 text-sm text-red-500">{errors.lng}</p>}
            </div>
          </div>
          
          {lat && lng && (
            <div className="mt-2 text-sm text-gray-500">
              Tip: Verify these coordinates are in Nepal before submitting. You can check by searching them on Google Maps.
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="funFact" className="block text-gray-700 font-medium mb-2">
            Fun Fact *
          </label>
          <textarea
            id="funFact"
            value={funFact}
            onChange={(e) => setFunFact(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${errors.funFact ? 'border-red-500' : 'border-gray-300'}`}
            rows={3}
            placeholder="Share an interesting fact about this location"
            disabled={isSubmitting}
          />
          {errors.funFact && <p className="mt-1 text-sm text-red-500">{errors.funFact}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Location Image *
          </label>
          
          <div className="flex items-center justify-center">
            <div className="w-full">
              <div 
                className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                  errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isSubmitting && fileInputRef.current?.click()}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Preview" className="mx-auto h-48 object-cover rounded" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImageFile(null);
                        setPreview(null);
                      }}
                      disabled={isSubmitting}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-500">Click to upload an image (max 5MB)</p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isSubmitting}
                />
              </div>
              {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
              
              {/* Upload progress bar */}
              {isSubmitting && uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Uploading image: {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : 'Submit Location'}
          </button>
        </div>
      </form>
    </div>
  );
}