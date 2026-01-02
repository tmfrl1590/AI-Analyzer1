import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { Footer } from './components/Footer';
import { analyzeImage } from './services/geminiService';
import { FoodAnalysisResult } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = useCallback(async (base64Image: string) => {
    setSelectedImage(base64Image);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(true);

    try {
      const result = await analyzeImage(base64Image);
      if (!result.isFood) {
        setError("AI가 이 이미지에서 음식을 인식하지 못했습니다. 음식 사진을 업로드해 주세요.");
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (err) {
      console.error(err);
      setError("이미지를 분석하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              AI 칼로리 분석기
            </h1>
            <p className="text-slate-600 text-lg">
              음식 사진을 올리면 AI가 칼로리와 영양소를 분석해 드립니다.
            </p>
          </div>

          {!selectedImage && (
            <div className="flex justify-center">
              <ImageUploader onImageSelect={handleImageSelect} />
            </div>
          )}

          {selectedImage && (
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                 <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-1/3">
                      <img 
                        src={selectedImage} 
                        alt="Selected food" 
                        className="w-full h-64 object-cover rounded-xl shadow-md"
                      />
                    </div>
                    <div className="w-full md:w-2/3 flex flex-col gap-4">
                       {isLoading ? (
                         <div className="flex flex-col items-center justify-center py-12 space-y-4">
                           <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                           <p className="text-lg font-medium text-slate-600 animate-pulse">
                             AI가 음식을 분석하고 있습니다...
                           </p>
                           <p className="text-sm text-slate-400">약 5-10초 정도 소요됩니다.</p>
                         </div>
                       ) : error ? (
                         <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex flex-col items-center text-center space-y-3">
                           <AlertCircle className="w-10 h-10 text-red-500" />
                           <p className="text-red-700 font-medium">{error}</p>
                           <button 
                             onClick={handleReset}
                             className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                           >
                             다른 사진 시도하기
                           </button>
                         </div>
                       ) : (
                         analysisResult && <AnalysisResults result={analysisResult} onReset={handleReset} />
                       )}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;