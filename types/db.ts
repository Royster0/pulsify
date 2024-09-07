import { Database } from "./supabase";

export type Workout = Database["public"]["Tables"]["Workouts"]["Row"];
export type Macro = Database["public"]["Tables"]["Macros"]["Row"];
export type Food = Database["public"]["Tables"]["Food"]["Row"];