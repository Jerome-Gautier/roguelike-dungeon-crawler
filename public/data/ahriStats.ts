import { Skill } from './skills';
import { Item } from './items';

export interface ChampionStats {
    name: string;
    level: number;
    health: number;
    healthMax: number;
    healthPerLevel: number;
    mana: number;
    manaMax: number;
    manaPerLevel: number;
    damageMin: number;
    damageMax: number;
    damagePerLevel: number;
    xp: number;
    xpToLevel: number;
    skills: Skill[];
    items: Item[];
}
export const ahriStats = {
    name: 'Ahri',
    level: 1,
    health: 100,
    healthMax: 100,
    healthPerLevel: 5,
    mana: 200,
    manaMax: 200,
    manaPerLevel: 10,
    damageMin: 10,
    damageMax: 15,
    damagePerLevel: 2,
    xp: 0,
    xpToLevel: 100,
    skills: [],
    items: [],
  };