import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Leaf, Egg, Drumstick, Utensils } from 'lucide-react';
import { DietType, DIET_TYPE_LABELS } from '@/types/database';
import { cn } from '@/lib/utils';

const dietOptions: { value: DietType; label: string; icon: React.ReactNode; description: string }[] = [
  {
    value: 'veg',
    label: DIET_TYPE_LABELS.veg,
    icon: <Leaf className="h-6 w-6" />,
    description: 'No meat or eggs',
  },
  {
    value: 'egg',
    label: DIET_TYPE_LABELS.egg,
    icon: <Egg className="h-6 w-6" />,
    description: 'Vegetarian + eggs',
  },
  {
    value: 'non_veg',
    label: DIET_TYPE_LABELS.non_veg,
    icon: <Drumstick className="h-6 w-6" />,
    description: 'All food types',
  },
];

export default function Onboarding() {
  const [selectedDiet, setSelectedDiet] = useState<DietType | null>(null);
  const [optionalGoal, setOptionalGoal] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedDiet || !user) {
      toast({
        title: 'Please select your diet type',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          diet_type: selectedDiet,
          optional_goal: optionalGoal || null,
          onboarding_completed: true,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      
      toast({
        title: 'All set!',
        description: "Let's start tracking your food balance.",
      });
      
      navigate('/');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Utensils className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Welcome to Calieori</h1>
          <p className="mt-2 text-muted-foreground">Let's personalize your experience</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">What's your diet preference?</CardTitle>
            <CardDescription>
              This helps us show relevant food options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Diet Type Selection */}
            <div className="grid gap-3">
              {dietOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedDiet(option.value)}
                  className={cn(
                    'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
                    selectedDiet === option.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  )}
                >
                  <div
                    className={cn(
                      'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                      selectedDiet === option.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    )}
                  >
                    {option.icon}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{option.label}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Optional Goal */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Any personal goal? <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                value={optionalGoal}
                onChange={(e) => setOptionalGoal(e.target.value)}
                placeholder="e.g., Eat more protein, reduce outside food"
                className="h-12 rounded-xl"
              />
              <p className="text-xs text-muted-foreground">
                This is just for your reference. We won't remind you about it.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              className="h-12 w-full rounded-xl text-base font-medium"
              disabled={!selectedDiet || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Let's go!"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
