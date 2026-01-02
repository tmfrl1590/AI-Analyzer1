import React from 'react';

export const AdBanner: React.FC = () => {
  return (
    <div className="w-full my-6 flex justify-center">
      {/* 
        실제 광고 코드(Google AdSense 등)를 이곳에 배치하세요.
        예: <ins class="adsbygoogle" ... ></ins> 
      */}
      <div className="w-full max-w-4xl h-24 bg-slate-100 border border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 text-sm overflow-hidden">
        <span className="font-medium">광고 배너 영역</span>
        <span className="text-xs mt-1">이 곳에 구글 애드센스 등의 광고 코드를 삽입하세요.</span>
      </div>
    </div>
  );
};