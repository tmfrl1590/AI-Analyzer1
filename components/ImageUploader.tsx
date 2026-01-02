import React, { useCallback, useRef, useState } from 'react';
import { Upload, Image as ImageIcon, Camera } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      onImageSelect(base64String);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [onImageSelect]);

  return (
    <div
      className={`relative w-full max-w-lg overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer group
        ${isDragging 
          ? 'border-blue-500 bg-blue-50 scale-[1.02]' 
          : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileInput}
      />
      
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-4">
        <div className={`p-4 rounded-full transition-colors duration-300 ${isDragging ? 'bg-blue-200' : 'bg-slate-100 group-hover:bg-blue-100'}`}>
          <Camera className={`w-10 h-10 ${isDragging ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-500'}`} />
        </div>
        
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-700">
            음식 사진 업로드
          </p>
          <p className="text-sm text-slate-500">
            클릭하여 촬영하거나 이미지를 드래그하세요
          </p>
        </div>

        <div className="flex gap-2 text-xs text-slate-400 mt-2">
           <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3"/> JPG, PNG, WEBP</span>
        </div>
      </div>
    </div>
  );
};