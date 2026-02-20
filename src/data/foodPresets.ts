import { DietType, FoodType } from '@/types/database';

export type OutsideCategory = 'wraps' | 'maincourse' | 'chinese' | 'desserts' | 'drinks' | 'popular' | 'grilled';

export interface FoodPresetData {
  name: string;
  food_type: FoodType;
  calorie_min: number;
  calorie_max: number;
  protein_amount: number;
  diet_types: DietType[];
  show_price: boolean;
  description?: string;
  outside_category?: OutsideCategory;
}

export const OUTSIDE_CATEGORIES: { key: OutsideCategory; label: string }[] = [
  { key: 'popular', label: 'Popular' },
  { key: 'wraps', label: 'Wraps' },
  { key: 'maincourse', label: 'Maincourse' },
  { key: 'chinese', label: 'Chinese' },
  { key: 'grilled', label: 'Grilled' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'drinks', label: 'Drinks' },
];

export const FOOD_PRESETS: FoodPresetData[] = [
  // Mess Meal Templates
  { name: 'Veg Regular', description: 'Dal + sabzi + rice/roti', food_type: 'mess_meal', calorie_min: 450, calorie_max: 650, protein_amount: 15, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Paneer Day', description: 'Paneer dish included', food_type: 'mess_meal', calorie_min: 650, calorie_max: 850, protein_amount: 26, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Chicken Day', description: 'Chicken dish included', food_type: 'mess_meal', calorie_min: 600, calorie_max: 800, protein_amount: 30, diet_types: ['non_veg'], show_price: false },
  { name: 'Egg Meal', description: 'Egg-based protein', food_type: 'mess_meal', calorie_min: 500, calorie_max: 700, protein_amount: 21, diet_types: ['egg', 'non_veg'], show_price: false },
  { name: 'Biryani Meal', description: 'Rice-heavy meal', food_type: 'mess_meal', calorie_min: 700, calorie_max: 950, protein_amount: 22, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },

  // Home Food Templates
  { name: 'Light Home Meal', food_type: 'home_food', calorie_min: 350, calorie_max: 500, protein_amount: 11, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Regular Home Meal', food_type: 'home_food', calorie_min: 500, calorie_max: 700, protein_amount: 16, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Protein-Rich Home Meal', food_type: 'home_food', calorie_min: 600, calorie_max: 850, protein_amount: 25, diet_types: ['veg', 'egg', 'non_veg'], show_price: false },
  { name: 'Non-Veg Home Meal', food_type: 'home_food', calorie_min: 650, calorie_max: 900, protein_amount: 30, diet_types: ['egg', 'non_veg'], show_price: false },

  // Outside Food — Popular
  { name: 'Maggi / Noodles', food_type: 'outside_food', calorie_min: 300, calorie_max: 450, protein_amount: 6, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Biryani', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 20, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Burger', food_type: 'outside_food', calorie_min: 350, calorie_max: 550, protein_amount: 15, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Pizza (2 slices)', food_type: 'outside_food', calorie_min: 400, calorie_max: 600, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Sandwich / Wrap', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Momos (6 pcs)', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Samosa (2 pcs)', food_type: 'outside_food', calorie_min: 300, calorie_max: 400, protein_amount: 5, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },
  { name: 'Chai + Biscuits', food_type: 'outside_food', calorie_min: 100, calorie_max: 200, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'popular' },

  // Outside Food — Wraps
  { name: 'Paneer Wrap', food_type: 'outside_food', calorie_min: 350, calorie_max: 500, protein_amount: 15, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'wraps' },
  { name: 'Aloo Wrap', food_type: 'outside_food', calorie_min: 400, calorie_max: 550, protein_amount: 7, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'wraps' },
  { name: 'Chicken Tikka Wrap', food_type: 'outside_food', calorie_min: 400, calorie_max: 600, protein_amount: 24, diet_types: ['non_veg'], show_price: true, outside_category: 'wraps' },
  { name: 'Egg Roll', food_type: 'outside_food', calorie_min: 350, calorie_max: 500, protein_amount: 17, diet_types: ['egg', 'non_veg'], show_price: true, outside_category: 'wraps' },

  // Outside Food — Grilled / Tikka
  { name: 'Grilled Chicken', food_type: 'outside_food', calorie_min: 200, calorie_max: 300, protein_amount: 30, diet_types: ['non_veg'], show_price: true, outside_category: 'grilled' },
  { name: 'Chicken Tikka', food_type: 'outside_food', calorie_min: 250, calorie_max: 350, protein_amount: 26, diet_types: ['non_veg'], show_price: true, outside_category: 'grilled' },
  { name: 'Fish Tikka', food_type: 'outside_food', calorie_min: 250, calorie_max: 350, protein_amount: 25, diet_types: ['non_veg'], show_price: true, outside_category: 'grilled' },
  { name: 'Paneer Tikka', food_type: 'outside_food', calorie_min: 300, calorie_max: 450, protein_amount: 19, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'grilled' },

  // Outside Food — Maincourse Veg
  { name: 'Paneer Meal', description: 'Rice or roti based meal', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 22, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Dal Makhni Meal', description: 'Rice or roti based meal', food_type: 'outside_food', calorie_min: 450, calorie_max: 700, protein_amount: 17, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Mixed Veg Meal', description: 'Rice or roti based meal', food_type: 'outside_food', calorie_min: 400, calorie_max: 650, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Chole Meal', description: 'Rice or roti based meal', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 18, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'maincourse' },

  // Outside Food — Maincourse Non-Veg
  { name: 'Chicken Curry Meal', description: 'Rice, roti or naan based meal', food_type: 'outside_food', calorie_min: 600, calorie_max: 850, protein_amount: 30, diet_types: ['non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Butter Chicken Meal', description: 'Rice, roti or naan based meal', food_type: 'outside_food', calorie_min: 700, calorie_max: 1000, protein_amount: 30, diet_types: ['non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Mutton Curry Meal', description: 'Rice, roti or naan based meal', food_type: 'outside_food', calorie_min: 700, calorie_max: 950, protein_amount: 34, diet_types: ['non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Fish Curry Meal', description: 'Rice, roti or naan based meal', food_type: 'outside_food', calorie_min: 550, calorie_max: 800, protein_amount: 30, diet_types: ['non_veg'], show_price: true, outside_category: 'maincourse' },

  // Outside Food — Chinese
  { name: 'Chili Paneer', food_type: 'outside_food', calorie_min: 400, calorie_max: 650, protein_amount: 18, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Chili Chicken', food_type: 'outside_food', calorie_min: 350, calorie_max: 550, protein_amount: 22, diet_types: ['non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Veg Fried Rice', food_type: 'outside_food', calorie_min: 400, calorie_max: 600, protein_amount: 8, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Chicken Fried Rice', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 22, diet_types: ['non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Veg Noodles', food_type: 'outside_food', calorie_min: 450, calorie_max: 650, protein_amount: 10, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Chicken Noodles', food_type: 'outside_food', calorie_min: 550, calorie_max: 800, protein_amount: 22, diet_types: ['non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Veg Momos', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 8, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Chicken Momos', food_type: 'outside_food', calorie_min: 300, calorie_max: 500, protein_amount: 15, diet_types: ['non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Spring Rolls', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 6, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },

  // Outside Food — Rice / Heavy Meals (kept under popular or maincourse — mapped to popular for backward compat)
  { name: 'Veg Biryani', food_type: 'outside_food', calorie_min: 450, calorie_max: 650, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Chicken Biryani', food_type: 'outside_food', calorie_min: 550, calorie_max: 800, protein_amount: 25, diet_types: ['non_veg'], show_price: true, outside_category: 'maincourse' },
  { name: 'Fried Rice (Veg)', food_type: 'outside_food', calorie_min: 400, calorie_max: 600, protein_amount: 8, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'chinese' },
  { name: 'Fried Rice (Chicken)', food_type: 'outside_food', calorie_min: 500, calorie_max: 750, protein_amount: 22, diet_types: ['non_veg'], show_price: true, outside_category: 'chinese' },

  // Outside Food — Desserts
  { name: 'Cake Slice', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Pastry', food_type: 'outside_food', calorie_min: 300, calorie_max: 450, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Cheesecake', food_type: 'outside_food', calorie_min: 350, calorie_max: 500, protein_amount: 6, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Waffle / Croffle', food_type: 'outside_food', calorie_min: 350, calorie_max: 550, protein_amount: 5, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Brownie', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Chocolava Cake', food_type: 'outside_food', calorie_min: 300, calorie_max: 450, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Cream Roll', food_type: 'outside_food', calorie_min: 200, calorie_max: 350, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Chocolate Bar', food_type: 'outside_food', calorie_min: 200, calorie_max: 300, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Toffees', food_type: 'outside_food', calorie_min: 80, calorie_max: 150, protein_amount: 0, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Sour Candy', food_type: 'outside_food', calorie_min: 100, calorie_max: 200, protein_amount: 0, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Ice Cream Stick', food_type: 'outside_food', calorie_min: 150, calorie_max: 300, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Ice Cream Cone', food_type: 'outside_food', calorie_min: 250, calorie_max: 400, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },
  { name: 'Sundae', food_type: 'outside_food', calorie_min: 350, calorie_max: 550, protein_amount: 5, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'desserts' },

  // Outside Food — Drinks
  { name: 'Chai', food_type: 'outside_food', calorie_min: 70, calorie_max: 120, protein_amount: 3, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'drinks' },
  { name: 'Coffee (Milk-based)', food_type: 'outside_food', calorie_min: 80, calorie_max: 130, protein_amount: 4, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'drinks' },
  { name: 'Hot Chocolate', food_type: 'outside_food', calorie_min: 200, calorie_max: 350, protein_amount: 7, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'drinks' },
  { name: 'Milkshake', food_type: 'outside_food', calorie_min: 300, calorie_max: 500, protein_amount: 12, diet_types: ['veg', 'egg', 'non_veg'], show_price: true, outside_category: 'drinks' },

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
