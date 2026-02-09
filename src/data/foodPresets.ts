import { DietType, FoodType } from '@/types/database';

export interface FoodPresetData {
  name: string;
  food_type: FoodType;
  calorie_min: number;
  calorie_max: number;
  protein_amount: number;
  diet_types: DietType[];
  show_price: boolean;
}

export const FOOD_PRESETS: FoodPresetData[] = [
  // Mess Meals
  { name: 'Breakfast (Idli/Dosa)', food_type: 'mess_meal', calorie_min: 300, calorie_max: 450, protein_amount: 8, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Breakfast (Paratha)', food_type: 'mess_meal', calorie_min: 350, calorie_max: 500, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Lunch (Veg Thali)', food_type: 'mess_meal', calorie_min: 500, calorie_max: 700, protein_amount: 15, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Lunch (Non-Veg Thali)', food_type: 'mess_meal', calorie_min: 550, calorie_max: 750, protein_amount: 25, diet_types: ['egg', 'non_veg'], show_price: false },
  { name: 'Lunch (Egg Curry + Rice)', food_type: 'mess_meal', calorie_min: 450, calorie_max: 600, protein_amount: 18, diet_types: ['egg', 'non_veg'], show_price: false },
  { name: 'Dinner (Roti + Sabzi)', food_type: 'mess_meal', calorie_min: 400, calorie_max: 550, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Dinner (Rice + Dal)', food_type: 'mess_meal', calorie_min: 450, calorie_max: 600, protein_amount: 14, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Dinner (Chicken + Rice)', food_type: 'mess_meal', calorie_min: 500, calorie_max: 700, protein_amount: 28, diet_types: ['non_veg'], show_price: false },

  // Home Food
  { name: 'Home Meal (Light)', food_type: 'home_food', calorie_min: 350, calorie_max: 500, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Home Meal (Regular)', food_type: 'home_food', calorie_min: 500, calorie_max: 700, protein_amount: 18, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Home Meal (Heavy)', food_type: 'home_food', calorie_min: 650, calorie_max: 850, protein_amount: 22, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },

  // Outside Food
  { name: 'Maggi / Noodles', food_type: 'outside_food', calorie_min: 300, calorie_max: 450, protein_amount: 6, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Biryani', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 20, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Burger', food_type: 'outside_food', calorie_min: 350, calorie_max: 550, protein_amount: 15, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Pizza (2 slices)', food_type: 'outside_food', calorie_min: 400, calorie_max: 600, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Sandwich / Wrap', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Momos (6 pcs)', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Samosa (2 pcs)', food_type: 'outside_food', calorie_min: 300, calorie_max: 400, protein_amount: 5, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Chai + Biscuits', food_type: 'outside_food', calorie_min: 100, calorie_max: 200, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },

  // Milk
  { name: 'Milk (1 glass)', food_type: 'milk', calorie_min: 100, calorie_max: 150, protein_amount: 8, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Milk + Cornflakes', food_type: 'milk', calorie_min: 200, calorie_max: 300, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },

  // Protein Shake
  { name: 'Whey Shake (1 scoop)', food_type: 'protein_shake', calorie_min: 100, calorie_max: 150, protein_amount: 24, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Whey Shake (2 scoops)', food_type: 'protein_shake', calorie_min: 200, calorie_max: 300, protein_amount: 48, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },

  // Fruit
  { name: 'Banana', food_type: 'fruit', calorie_min: 80, calorie_max: 120, protein_amount: 1, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Apple', food_type: 'fruit', calorie_min: 70, calorie_max: 100, protein_amount: 0, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
  { name: 'Mixed Fruits', food_type: 'fruit', calorie_min: 100, calorie_max: 180, protein_amount: 1, diet_types: ['veg', 'egg', 'non_veg'], show_price: true },
];

export const FOOD_TYPE_ICONS: Record<FoodType, string> = {
  mess_meal: '🍽️',
  home_food: '🏠',
  outside_food: '🍔',
  milk: '🥛',
  protein_shake: '💪',
  fruit: '🍎',
};

// Calorie thresholds for daily status
export const DAILY_CALORIE_TARGET = { min: 1800, max: 2400 };
export const DAILY_PROTEIN_TARGET = 50; // grams
