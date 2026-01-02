export interface Macronutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodAnalysisResult {
  foodName: string;
  totalCalories: number;
  macros: Macronutrients;
  healthTip: string;
  isFood: boolean;
  ingredients: string[];
}
