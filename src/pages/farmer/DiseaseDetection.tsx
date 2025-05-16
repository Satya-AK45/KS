import React, { useState, useRef } from 'react';
import { Upload, Camera, AlertCircle, Check, Loader2 } from 'lucide-react';
import { detectPlantDisease } from '../../services/geminiService';
import Button from '../../components/common/Button';

const DiseaseDetection: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraToggle = async () => {
    if (cameraActive) {
      // Stop camera
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    } else {
      try {
        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
        setCameraActive(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Failed to access camera. Please check permissions.');
      }
    }
  };

  const captureImage = () => {
    if (videoRef.current && streamRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        
        // Stop camera after capturing
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        setCameraActive(false);
      }
    }
  };

  const handleDetect = async () => {
    if (!image) return;

    setLoading(true);
    setResult(null);
    
    try {
      const analysis = await detectPlantDisease(image);
      setResult(analysis);
    } catch (error) {
      console.error('Error detecting disease:', error);
      setResult('Failed to analyze the image. Please try again with a clearer image.');
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImage(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Make sure camera is off
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Plant Disease Detection</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Upload Plant Image</h2>
            
            {!image ? (
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center ${
                  dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {!cameraActive ? (
                  <>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Drag & drop an image or click to upload
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: JPG, PNG, JPEG (max 5MB)
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCameraToggle}
                        icon={<Camera className="h-4 w-4" />}
                      >
                        Use Camera
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full rounded-lg mb-4"
                    />
                    <div className="flex justify-center gap-3">
                      <Button onClick={captureImage}>
                        Take Photo
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={handleCameraToggle}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-gray-200">
                  <img 
                    src={image} 
                    alt="Plant for disease detection" 
                    className="w-full h-auto max-h-80 object-contain" 
                  />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={handleDetect}
                    isLoading={loading}
                  >
                    Detect Disease
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetAll}
                  >
                    Upload New Image
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Tips for Better Results</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Ensure good lighting when taking photos</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Focus on the affected area of the plant</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Include both healthy and affected parts for comparison</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Avoid shadows and reflections</span>
              </li>
              <li className="flex items-start">
                <Check className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>Take multiple photos from different angles for accuracy</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Results Section */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
            <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
                <p className="mt-4 text-gray-600">Analyzing the image for plant diseases...</p>
              </div>
            ) : result ? (
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ 
                  __html: result.replace(/\n/g, '<br />') 
                }} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <AlertCircle className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No analysis yet
                </h3>
                <p className="text-gray-600">
                  Upload a plant image and click "Detect Disease" to get an AI-powered analysis
                  of any potential diseases or issues.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold mb-6">Common Plant Diseases</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Early Blight</h3>
              <p className="text-sm text-gray-600">
                Affects: Tomatoes, Potatoes<br />
                Symptoms: Brown spots with concentric rings<br />
                Treatment: Fungicides, proper spacing
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Powdery Mildew</h3>
              <p className="text-sm text-gray-600">
                Affects: Cucumbers, Squash, Grapes<br />
                Symptoms: White powdery spots on leaves<br />
                Treatment: Neem oil, potassium bicarbonate
              </p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4">
              <h3 className="font-medium text-lg mb-2">Bacterial Leaf Spot</h3>
              <p className="text-sm text-gray-600">
                Affects: Peppers, Tomatoes<br />
                Symptoms: Dark, water-soaked spots<br />
                Treatment: Copper-based sprays
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;