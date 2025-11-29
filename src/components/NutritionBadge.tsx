import { Badge } from "./ui/badge";

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface NutritionBadgeProps {
  nutrition: NutritionInfo;
  compact?: boolean;
}

export function NutritionBadge({ nutrition, compact = false }: NutritionBadgeProps) {
  if (compact) {
    return (
      <div className="flex gap-2 flex-wrap">
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
          {nutrition.calories} cal
        </Badge>
        <Badge variant="secondary" style={{ backgroundColor: '#FEE8D6', color: '#E87722' }} className="hover:bg-orange-50">
          {nutrition.protein}g protein
        </Badge>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Calories</span>
        <span className="text-gray-900">{nutrition.calories}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Protein</span>
        <span className="text-gray-900">{nutrition.protein}g</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Carbs</span>
        <span className="text-gray-900">{nutrition.carbs}g</span>
      </div>
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Fat</span>
        <span className="text-gray-900">{nutrition.fat}g</span>
      </div>
    </div>
  );
}
