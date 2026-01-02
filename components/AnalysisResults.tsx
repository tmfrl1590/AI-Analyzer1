import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FoodAnalysisResult } from '../types';
import { RefreshCcw, Info, Activity, Footprints, Bike, Flame } from 'lucide-react';

interface AnalysisResultsProps {
  result: FoodAnalysisResult;
  onReset: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue, Emerald, Amber

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, onReset }) => {
  const macroData = [
    { name: '단백질 (g)', value: result.macros.protein },
    { name: '탄수화물 (g)', value: result.macros.carbs },
    { name: '지방 (g)', value: result.macros.fat },
  ];

  // 건강 점수에 따른 색상 결정
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 50) return 'text-amber-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-red-100 text-red-700 border-red-200';
  };

  return (
    <div className="flex flex-col h-full animate-fade-in space-y-6">
      {/* Header Section */}
      <div>
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{result.foodName}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                    {result.tags?.map((tag, i) => (
                        <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-full border border-indigo-100 font-medium">
                            {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                    ))}
                </div>
            </div>
            <div className="text-right">
                <span className="block text-sm text-slate-500 font-medium uppercase tracking-wide">총 칼로리</span>
                <span className="text-4xl font-extrabold text-blue-600">{result.totalCalories}</span>
                <span className="text-lg text-slate-600 font-semibold ml-1">kcal</span>
            </div>
        </div>
      </div>

      {/* Health Score & Macros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Health Score Card */}
        <div className={`md:col-span-1 p-4 rounded-xl border flex flex-col items-center justify-center text-center ${getScoreBg(result.healthScore)}`}>
            <span className="text-sm font-semibold mb-1 opacity-80">건강 점수</span>
            <div className="text-4xl font-black">{result.healthScore}</div>
            <span className="text-xs mt-1 font-medium opacity-75">100점 만점</span>
        </div>

        {/* Macro Cards */}
        <div className="md:col-span-3 grid grid-cols-3 gap-3">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center flex flex-col justify-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">단백질</p>
                <p className="text-xl font-bold text-slate-800">{result.macros.protein}g</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center flex flex-col justify-center">
                <p className="text-xs text-emerald-600 font-semibold mb-1">탄수화물</p>
                <p className="text-xl font-bold text-slate-800">{result.macros.carbs}g</p>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center flex flex-col justify-center">
                <p className="text-xs text-amber-600 font-semibold mb-1">지방</p>
                <p className="text-xl font-bold text-slate-800">{result.macros.fat}g</p>
            </div>
        </div>
      </div>

      {/* Chart & Tip Section */}
      <div className="flex flex-col md:flex-row gap-6">
         {/* Chart */}
         <div className="w-full md:w-1/2 h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">비율</span>
            </div>
         </div>

         {/* Health Tip */}
         <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 h-full">
                <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">AI 영양 코멘트</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm">
                    {result.healthTip}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-400 mb-1">주요 재료</p>
                    <p className="text-xs text-slate-600 font-medium">
                        {result.ingredients.join(', ')}
                    </p>
                </div>
            </div>
         </div>
      </div>

      {/* Exercise Equivalents (Burn It Off) */}
      {result.exercise && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-slate-800">이 칼로리를 태우려면?</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                    <Footprints className="w-6 h-6 text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 mb-1">걷기</span>
                    <span className="text-lg font-bold text-slate-800">{result.exercise.walking}분</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                    <Activity className="w-6 h-6 text-blue-400 mb-2" />
                    <span className="text-xs text-slate-500 mb-1">달리기</span>
                    <span className="text-lg font-bold text-slate-800">{result.exercise.running}분</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-slate-50 rounded-lg">
                    <Bike className="w-6 h-6 text-green-400 mb-2" />
                    <span className="text-xs text-slate-500 mb-1">자전거</span>
                    <span className="text-lg font-bold text-slate-800">{result.exercise.cycling}분</span>
                </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3">
                * 성인 표준 체중 기준 대략적인 수치입니다. 개인차가 있을 수 있습니다.
            </p>
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95 w-full md:w-auto justify-center"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>다른 사진 분석하기</span>
        </button>
      </div>
    </div>
  );
};