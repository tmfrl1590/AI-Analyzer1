import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { FoodAnalysisResult } from '../types';
import { RefreshCcw, CheckCircle2, Info } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{result.foodName}</h2>
                <div className="flex flex-wrap gap-2 mb-2">
                    {result.ingredients.slice(0, 3).map((ing, i) => (
                        <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">
                            {ing}
                        </span>
                    ))}
                    {result.ingredients.length > 3 && (
                         <span className="text-xs text-slate-400 py-1">+{result.ingredients.length - 3} 개 더보기</span>
                    )}
                </div>
            </div>
            <div className="text-right">
                <span className="block text-sm text-slate-500 font-medium uppercase tracking-wide">총 칼로리</span>
                <span className="text-4xl font-extrabold text-blue-600">{result.totalCalories}</span>
                <span className="text-lg text-slate-600 font-semibold ml-1">kcal</span>
            </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
            <p className="text-xs text-blue-600 font-semibold mb-1">단백질</p>
            <p className="text-xl font-bold text-slate-800">{result.macros.protein}g</p>
        </div>
        <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 text-center">
            <p className="text-xs text-emerald-600 font-semibold mb-1">탄수화물</p>
            <p className="text-xl font-bold text-slate-800">{result.macros.carbs}g</p>
        </div>
        <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
            <p className="text-xs text-amber-600 font-semibold mb-1">지방</p>
            <p className="text-xl font-bold text-slate-800">{result.macros.fat}g</p>
        </div>
      </div>

      <div className="flex-grow flex flex-col md:flex-row gap-6 mb-6">
         {/* Chart Section */}
         <div className="w-full md:w-1/2 h-48 md:h-auto min-h-[200px] relative">
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
            {/* Center Label for Donut */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
                <span className="text-xs text-slate-400 font-medium">영양소</span>
            </div>
         </div>

         {/* Health Tip Section */}
         <div className="w-full md:w-1/2 flex flex-col justify-center">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-bold text-slate-700">건강 팁</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">
                    {result.healthTip}
                </p>
            </div>
         </div>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 flex justify-end">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all font-medium shadow-lg shadow-slate-200 hover:shadow-xl active:scale-95"
        >
          <RefreshCcw className="w-4 h-4" />
          <span>다른 사진 분석하기</span>
        </button>
      </div>
    </div>
  );
};