// Custom types for Calieori app

export type DietType = 'veg' | 'egg' | 'non_veg';
export type FoodType = 'mess_meal' | 'home_food' | 'outside_food' | 'milk' | 'protein_shake' | 'fruit';
export type PortionSize = 'smaller' | 'usual' | 'heavier';
export type PriceBand = 'low' | 'medium' | 'high';
export type CalorieStatus = 'low' | 'ok' | 'high';
export type ProteinStatus = 'low' | 'ok';
export type EndOfDayStatus = 'balanced' | 'slightly_off';

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  diet_type: DietType | null;
  optional_goal: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface FoodLog {
  id: string;
  user_id: string;
  date: string;
  food_type: FoodType;
  food_name: string | null;
  portion_size: PortionSize;
  calorie_min: number;
  calorie_max: number;
  protein_amount: number;
  price_amount: number | null;
  price_band: PriceBand | null;
  logged_at: string;
  created_at: string;
}

export interface DailyStatus {
  id: string;
  user_id: string;
  date: string;
  calorie_status: CalorieStatus | null;
  protein_status: ProteinStatus | null;
  end_of_day_status: EndOfDayStatus | null;
  total_calorie_min: number;
  total_calorie_max: number;
  total_protein: number;
  created_at: string;
  updated_at: string;
}

export interface DailySpend {
  id: string;
  user_id: string;
  date: string;
  outside_spend_total: number;
  addon_spend_total: number;
  total_spend: number;
  created_at: string;
  updated_at: string;
}

// Food presets with calorie ranges and protein amounts
export interface FoodPreset {
  id: string;
  name: string;
  food_type: FoodType;
  calorie_min: number;
  calorie_max: number;
  protein_amount: number;
  diet_types: DietType[];
}

// Portion size multipliers
export const PORTION_MULTIPLIERS: Record<PortionSize, number> = {
  smaller: 0.85,
  usual: 1,
  heavier: 1.15,
};

// Display labels
export const FOOD_TYPE_LABELS: Record<FoodType, string> = {
  mess_meal: 'Mess Meal',
  home_food: 'Home Food',
  outside_food: 'Outside Food',
  milk: 'Milk',
  protein_shake: 'Protein Shake',
  fruit: 'Fruit',
};

export const DIET_TYPE_LABELS: Record<DietType, string> = {
  veg: 'Vegetarian',
  egg: 'Eggetarian',
  non_veg: 'Non-Vegetarian',
};

export const PORTION_SIZE_LABELS: Record<PortionSize, string> = {
  smaller: 'Smaller (−15%)',
  usual: 'Usual',
  heavier: 'Heavier (+15%)',
};

export const PRICE_BAND_LABELS: Record<PriceBand, string> = {
  low: '₹',
  medium: '₹₹',
  high: '₹₹₹',
};
