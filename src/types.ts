export interface ActionLog {
  id: string;
  action_title: string;
  carbon_saved_kg: number;
  category: string;
  created_at: string;
}

export interface EcoAction {
  id: string;
  title: string;
  category: string;
  carbon_saved_kg: number;
}
