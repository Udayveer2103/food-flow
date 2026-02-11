import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FoodLogEntry } from '@/hooks/useFoodLogs';
import { FOOD_TYPE_LABELS, PORTION_SIZE_LABELS, PRICE_BAND_LABELS } from '@/types/database';
import { FOOD_TYPE_ICONS } from '@/data/foodPresets';
import { Utensils, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  logs: FoodLogEntry[];
  onDelete: (id: string) => void;
}

export default function FoodLogList({ logs, onDelete }: Props) {
  return (
    <Card className="border-0 shadow-md animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Today's Log</CardTitle>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
              <Utensils className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Nothing logged yet today.</p>
            <p className="text-xs text-muted-foreground mt-1">Tap "Log Food" to get started.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3 rounded-xl bg-muted/20 p-3 group transition-all duration-150 hover:shadow-sm"
              >
                <span className="text-xl mt-0.5">{FOOD_TYPE_ICONS[log.food_type]}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {log.food_name || FOOD_TYPE_LABELS[log.food_type]}
                    </p>
                    <button
                      onClick={() => onDelete(log.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-1 rounded-lg hover:bg-destructive/10"
                      aria-label="Remove log"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      {log.calorie_min}–{log.calorie_max} cal
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {log.protein_amount}g protein
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {PORTION_SIZE_LABELS[log.portion_size]}
                    </span>
                    {log.price_band && (
                      <span className="text-xs text-muted-foreground">
                        {PRICE_BAND_LABELS[log.price_band]}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {format(new Date(log.logged_at), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
