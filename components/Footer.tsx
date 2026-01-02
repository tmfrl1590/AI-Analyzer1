import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 mt-8">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          결과는 추정치이며 실제 영양 성분과 다를 수 있습니다.
        </p>
      </div>
    </footer>
  );
};