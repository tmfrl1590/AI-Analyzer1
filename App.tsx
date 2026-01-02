import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResults } from './components/AnalysisResults';
import { Footer } from './components/Footer';
import { AdBanner } from './components/AdBanner';
import { analyzeImage } from './services/geminiService';
import { FoodAnalysisResult } from './types';
import { Loader2, AlertCircle, Hourglass } from 'lucide-react';

const App: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState<boolean>(false);

  // TODO: 여기에 실제 구글 애드센스 정보를 입력하고 IS_TEST_MODE를 false로 변경하세요.
  const AD_CLIENT_ID = "ca-pub-XXXXXXXXXXXXXXXX"; 
  const AD_SLOT_ID = "1234567890"; 
  const IS_TEST_MODE = true; // 실제 광고를 보려면 false로 변경하세요.

  const handleImageSelect = useCallback(async (base64Image: string) => {
    setSelectedImage(base64Image);
    setAnalysisResult(null);
    setError(null);
    setIsQuotaError(false);
    setIsLoading(true);

    try {
      const result = await analyzeImage(base64Image);
      if (!result.isFood) {
        setError("AI가 이 이미지에서 음식을 인식하지 못했습니다. 음식 사진을 업로드해 주세요.");
        setAnalysisResult(null);
      } else {
        setAnalysisResult(result);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message === "QUOTA_EXCEEDED") {
        setError("현재 이용자가 많아 AI 분석량이 한도를 초과했습니다. 잠시 후(약 1분 뒤) 다시 시도해 주세요.");
        setIsQuotaError(true);
      } else {
        setError("이미지를 분석하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setError(null);
    setIsQuotaError(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              AI 칼로리 분석
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
                         <div className={`border rounded-xl p-6 flex flex-col items-center text-center space-y-3 ${isQuotaError ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                           {isQuotaError ? (
                               <Hourglass className="w-10 h-10 text-amber-500" />
                           ) : (
                               <AlertCircle className="w-10 h-10 text-red-500" />
                           )}
                           <p className={`font-medium ${isQuotaError ? 'text-amber-800' : 'text-red-700'}`}>
                             {error}
                           </p>
                           <button 
                             onClick={handleReset}
                             className={`px-4 py-2 bg-white border rounded-lg transition-colors font-medium text-sm
                               ${isQuotaError 
                                 ? 'border-amber-200 text-amber-700 hover:bg-amber-50' 
                                 : 'border-red-200 text-red-600 hover:bg-red-50'
                               }`}
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

          {/* 하단 광고 배너 영역 */}
          <div className="mt-8 w-full">
            <AdBanner 
              client={AD_CLIENT_ID} 
              slot={AD_SLOT_ID} 
              isTestMode={IS_TEST_MODE} 
              format="auto"
              className="w-full"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default App;