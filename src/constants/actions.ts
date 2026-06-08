import type { EcoAction } from '../types';

export const ECO_ACTIONS: EcoAction[] = [
  { id: '1', title: 'Cycled/Walked to work', carbon_saved_kg: 2.5, category: 'Transport' },
  { id: '2', title: 'Used public transport', carbon_saved_kg: 1.8, category: 'Transport' },
  { id: '3', title: 'Plant-based meal', carbon_saved_kg: 2.0, category: 'Diet' },
  { id: '4', title: 'Zero food waste day', carbon_saved_kg: 0.8, category: 'Diet' },
  { id: '5', title: 'Line dried clothes', carbon_saved_kg: 1.2, category: 'Energy' },
  { id: '6', title: 'Used reusable coffee cup', carbon_saved_kg: 0.1, category: 'Waste' },
  { id: '7', title: 'Turned off lights/unplugged devices', carbon_saved_kg: 0.5, category: 'Energy' }
];
