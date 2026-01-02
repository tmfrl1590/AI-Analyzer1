export interface Macronutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface ExerciseEquivalent {
  walking: number; // minutes
  running: number; // minutes
  cycling: number; // minutes
}

export interface FoodAnalysisResult {
  foodName: string;
  totalCalories: number;
  macros: Macronutrients;
  healthTip: string;
  isFood: boolean;
  ingredients: string[];
  tags: string[]; // e.g., ["High Protein", "Low Carb"]
  exercise: ExerciseEquivalent;
}