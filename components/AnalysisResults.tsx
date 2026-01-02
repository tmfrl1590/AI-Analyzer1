import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FoodAnalysisResult } from '../types';
import { RefreshCcw, Info, Activity, Footprints, Bike, Flame } from 'lucide-react';

interface AnalysisResultsProps {
  result: FoodAnalysisResult;
  onReset: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue (Protein), Emerald (Carbs), Amber (Fat)

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset }) => {
  const macroData = [
    { name: '단백질', value: result.macros.protein },
    { name: '탄수화물', value: result.macros.carbs },
    { name: '지방', value: result.macros.fat },
  ];

  // 건강 점수 스타일링 헬퍼
  const getScoreStyles = (score: number) => {
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'text-emerald-700/80' };
    if (score >= 50) return { bg: 'bg-amber-50', text: 'text-amber-600', label: 'text-amber-700/80' };
    return { bg: 'bg-red-50', text: 'text-red-500', label: 'text-red-700/80' };
  };

  const scoreStyle = getScoreStyles(result.healthScore);

  return (
    <div className="flex flex-col animate-fade-in">
      
      {/* 1. Header Section: Name & Total Calories */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 leading-tight">
            {result.foodName}
          </h2>
          <div className="flex flex-wrap gap-2">
            {result.tags?.map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100"
              >
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col md:items-end mt-2 md:mt-0">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">총 칼로리</span>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-slate-900 tracking-tighter">
              {result.totalCalories}
            </span>
            <span className="text-xl font-bold text-slate-500">kcal</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (Score + Macros) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Health Score */}
        <div className={`rounded-2xl p-5 flex flex-col items-center justify-center text-center aspect-[4/3] md:aspect-auto ${scoreStyle.bg}`}>
          <span className={`text-sm font-semibold mb-2 ${scoreStyle.label}`}>건강 점수</span>
          <span className={`text-4xl md:text-5xl font-black ${scoreStyle.text} mb-1`}>
            {result.healthScore}
          </span>
          <span className="text-[10px] font-medium opacity-60 text-slate-900">100점 만점</span>
        </div>

        {/* Protein */}
        <div className="bg-blue-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center aspect-[4/3] md:aspect-auto">
          <span className="text-sm font-semibold text-blue-600/80 mb-2">단백질</span>
          <span className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">
            {result.macros.protein}
            <span className="text-lg font-medium text-slate-500 ml-0.5">g</span>
          </span>
        </div>

        {/* Carbs */}
        <div className="bg-emerald-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center aspect-[4/3] md:aspect-auto">
          <span className="text-sm font-semibold text-emerald-600/80 mb-2">탄수화물</span>
          <span className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">
            {result.macros.carbs}
            <span className="text-lg font-medium text-slate-500 ml-0.5">g</span>
          </span>
        </div>

        {/* Fat */}
        <div className="bg-amber-50 rounded-2xl p-5 flex flex-col items-center justify-center text-center aspect-[4/3] md:aspect-auto">
          <span className="text-sm font-semibold text-amber-600/80 mb-2">지방</span>
          <span className="text-3xl md:text-4xl font-bold text-slate-800 mb-1">
            {result.macros.fat}
            <span className="text-lg font-medium text-slate-500 ml-0.5">g</span>
          </span>
        </div>
      </div>

      {/* 3. Analysis Detail Section (Chart & Text) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Left: Donut Chart */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center relative shadow-sm min-h-[280px]">
          <h3 className="text-sm font-bold text-slate-500 absolute top-6 left-6">영양소 비율</h3>
          <div className="w-full h-48 md:h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `${value}g`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)', fontSize: '14px', fontWeight: 'bold' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span className="text-slate-600 font-medium ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text for Donut */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -mt-4 text-center pointer-events-none">
              <span className="text-xs font-semibold text-slate-400 block">총 중량</span>
              <span className="text-xl font-bold text-slate-700">
                {result.macros.protein + result.macros.carbs + result.macros.fat}g
              </span>
            </div>
          </div>
        </div>

        {/* Right: AI Comment */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col h-full shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-slate-800">AI 영양 코멘트</span>
          </div>
          
          <div className="flex-grow">
            <p className="text-slate-700 leading-relaxed text-[15px] font-medium">
              {result.healthTip}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase mb-2 block">분석된 재료</span>
            <p className="text-sm text-slate-600 leading-normal">
              {result.ingredients.join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Exercise Equivalents */}
      {result.exercise && (
        <div className="border border-slate-200 rounded-3xl p-6 md:p-8 bg-white shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-orange-100 p-2 rounded-full">
              <Flame className="w-5 h-5 text-orange-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">이 칼로리를 태우려면?</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Walking */}
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl shadow-sm mr-4 text-slate-400">
                <Footprints className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">걷기</span>
                <span className="text-2xl font-black text-slate-800">{result.exercise.walking}</span>
                <span className="text-sm font-medium text-slate-500 ml-1">분</span>
              </div>
            </div>

            {/* Running */}
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl shadow-sm mr-4 text-blue-400">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">달리기</span>
                <span className="text-2xl font-black text-slate-800">{result.exercise.running}</span>
                <span className="text-sm font-medium text-slate-500 ml-1">분</span>
              </div>
            </div>

            {/* Cycling */}
            <div className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="bg-white p-3 rounded-xl shadow-sm mr-4 text-green-400">
                <Bike className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1">자전거</span>
                <span className="text-2xl font-black text-slate-800">{result.exercise.cycling}</span>
                <span className="text-sm font-medium text-slate-500 ml-1">분</span>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-4 text-right">
            * 성인 표준 체중(65kg) 기준 추정치입니다.
          </p>
        </div>
      )}

      {/* Bottom Button */}
      <div className="flex justify-center md:justify-end">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-200 group"
        >
          <RefreshCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-semibold text-lg">다른 사진 분석하기</span>
        </button>
      </div>
    </div>
  );
};