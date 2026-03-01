export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      daily_spend: {
        Row: {
          addon_spend_total: number | null
          created_at: string | null
          date: string
          id: string
          outside_spend_total: number | null
          total_spend: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          addon_spend_total?: number | null
          created_at?: string | null
          date: string
          id?: string
          outside_spend_total?: number | null
          total_spend?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          addon_spend_total?: number | null
          created_at?: string | null
          date?: string
          id?: string
          outside_spend_total?: number | null
          total_spend?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_state: {
        Row: {
          created_at: string | null
          date: string
          id: string
          state: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          id?: string
          state: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          state?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_status: {
        Row: {
          calorie_status: Database["public"]["Enums"]["calorie_status"] | null
          created_at: string | null
          date: string
          end_of_day_status:
            | Database["public"]["Enums"]["end_of_day_status"]
            | null
          id: string
          protein_status: Database["public"]["Enums"]["protein_status"] | null
          total_calorie_max: number | null
          total_calorie_min: number | null
          total_protein: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          calorie_status?: Database["public"]["Enums"]["calorie_status"] | null
          created_at?: string | null
          date: string
          end_of_day_status?:
            | Database["public"]["Enums"]["end_of_day_status"]
            | null
          id?: string
          protein_status?: Database["public"]["Enums"]["protein_status"] | null
          total_calorie_max?: number | null
          total_calorie_min?: number | null
          total_protein?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          calorie_status?: Database["public"]["Enums"]["calorie_status"] | null
          created_at?: string | null
          date?: string
          end_of_day_status?:
            | Database["public"]["Enums"]["end_of_day_status"]
            | null
          id?: string
          protein_status?: Database["public"]["Enums"]["protein_status"] | null
          total_calorie_max?: number | null
          total_calorie_min?: number | null
          total_protein?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          calorie_max: number
          calorie_min: number
          created_at: string | null
          date: string
          food_name: string | null
          food_type: Database["public"]["Enums"]["food_type"]
          id: string
          logged_at: string | null
          portion_size: Database["public"]["Enums"]["portion_size"]
          price_amount: number | null
          price_band: Database["public"]["Enums"]["price_band"] | null
          protein_amount: number
          user_id: string
        }
        Insert: {
          calorie_max: number
          calorie_min: number
          created_at?: string | null
          date?: string
          food_name?: string | null
          food_type: Database["public"]["Enums"]["food_type"]
          id?: string
          logged_at?: string | null
          portion_size?: Database["public"]["Enums"]["portion_size"]
          price_amount?: number | null
          price_band?: Database["public"]["Enums"]["price_band"] | null
          protein_amount?: number
          user_id: string
        }
        Update: {
          calorie_max?: number
          calorie_min?: number
          created_at?: string | null
          date?: string
          food_name?: string | null
          food_type?: Database["public"]["Enums"]["food_type"]
          id?: string
          logged_at?: string | null
          portion_size?: Database["public"]["Enums"]["portion_size"]
          price_amount?: number | null
          price_band?: Database["public"]["Enums"]["price_band"] | null
          protein_amount?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          diet_type: Database["public"]["Enums"]["diet_type"] | null
          email: string | null
          id: string
          onboarding_completed: boolean | null
          optional_goal: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"] | null
          email?: string | null
          id?: string
          onboarding_completed?: boolean | null
          optional_goal?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          diet_type?: Database["public"]["Enums"]["diet_type"] | null
          email?: string | null
          id?: string
          onboarding_completed?: boolean | null
          optional_goal?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      calorie_status: "low" | "ok" | "high"
      diet_type: "veg" | "egg" | "non_veg"
      end_of_day_status: "balanced" | "slightly_off"
      food_type:
        | "mess_meal"
        | "home_food"
        | "outside_food"
        | "milk"
        | "protein_shake"
        | "fruit"
      portion_size: "smaller" | "usual" | "heavier"
      price_band: "low" | "medium" | "high"
      protein_status: "low" | "ok"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      calorie_status: ["low", "ok", "high"],
      diet_type: ["veg", "egg", "non_veg"],
      end_of_day_status: ["balanced", "slightly_off"],
      food_type: [
        "mess_meal",
        "home_food",
        "outside_food",
        "milk",
        "protein_shake",
        "fruit",
      ],
      portion_size: ["smaller", "usual", "heavier"],
      price_band: ["low", "medium", "high"],
      protein_status: ["low", "ok"],
    },
  },
} as const
