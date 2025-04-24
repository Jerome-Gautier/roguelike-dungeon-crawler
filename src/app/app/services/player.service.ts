import { Injectable } from '@angular/core';
import { ahriStats } from '../../../../public/data/ahriStats';
import { skills } from '../../../../public/data/skills';
import { items } from '../../../../public/data/items';
import { Enemy } from '../../../../public/data/enemies';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  name: string = ahriStats.name;
  level: number = ahriStats.level;
  health: number = ahriStats.healthMax;
  healthMax: number = ahriStats.healthMax;
  healthPerLevel: number = ahriStats.healthPerLevel;
  mana: number = ahriStats.manaMax;
  manaMax: number = ahriStats.manaMax;
  manaPerLevel: number = ahriStats.manaPerLevel;
  damageMin: number = ahriStats.damageMin;
  damageMax: number = ahriStats.damageMax;
  damagePerlLevel: number = ahriStats.damagePerLevel;
  xp: number = 0;
  xpToLevel: number = 100;
  skills = JSON.parse(JSON.stringify(skills));
  skillsList = Object.keys(this.skills);
  items = JSON.parse(JSON.stringify(items));
  itemsList = Object.keys(this.items);

  resetPlayerStats() {
    this.name = ahriStats.name;
    this.level = ahriStats.level;
    this.health = ahriStats.healthMax;
    this.healthMax = ahriStats.healthMax;
    this.healthPerLevel = ahriStats.healthPerLevel;
    this.mana = ahriStats.manaMax;
    this.manaMax = ahriStats.manaMax;
    this.manaPerLevel = ahriStats.manaPerLevel;
    this.damageMin = ahriStats.damageMin;
    this.damageMax = ahriStats.damageMax;
    this.damagePerlLevel = ahriStats.damagePerLevel;
    this.xp = ahriStats.xp;
    this.xpToLevel = ahriStats.xpToLevel;
    this.skills = JSON.parse(JSON.stringify(skills));
    this.skillsList = Object.keys(this.skills);
    this.items = JSON.parse(JSON.stringify(items));
    this.itemsList = Object.keys(this.items);
  }

  fightEnemy(enemy: Enemy) {
    const ahriDmg = Math.floor(
      Math.random() * (this.damageMax - this.damageMin + 1) + this.damageMin
    );
    enemy.health -= ahriDmg;
    console.log(enemy);
    if (enemy.health <= 0 || enemy.isCharmed) {
      this.enemyDefeated(enemy);
      return {
        status: 'victory',
        message: `You defeated ${enemy.name} and gained ${enemy.xp} XP.`,
        enemy: enemy,
      };
    } else {
      const enemyDmg = Math.floor(
        Math.random() * (enemy.damageMax - enemy.damageMin + 1) +
          enemy.damageMin
      );
      this.health -= enemyDmg;
      if (this.health <= 0) {
        this.health = 0;
        return {
          status: 'defeated',
          message: `You have been defeated by ${enemy.name}.`,
          enemy: enemy,
        };
      }
      return {
        status: 'draw',
        message: `You fought ${enemy.name}, striking him for ${ahriDmg} damage, he retaliated and inflicted ${enemyDmg} to Ahri.`,
        enemy: enemy,
      };
    }
  }

  collectItem(item: string) {
    if (this.items[item]) {
      this.items[item].owned++;
      if (item === 'memory_shard') {
        const healthGained = this.items[item].effects['health'];
        const manaGained = this.items[item].effects['mana'];
        this.health += healthGained;
        this.healthMax += healthGained;
        this.mana += manaGained;
        this.manaMax += manaGained;
        this.damageMin++;
        this.damageMax++;
        this.xp += this.items[item].effects['xp'];
        if (this.xp >= this.xpToLevel) {
          this.levelUp();
        }
      }
      return { message: `Collected ${this.items[item].name}.` };
    } else {
      return { message: `Item ${item} not found.` };
    }
  }

  learnSkill(skill: string) {
    if (this.skills[skill]) {
      if (skill === 'essencetheft') {
        this.health = this.healthMax;
        this.mana = this.manaMax;
      } else {
        const manaCost = this.skills[skill].manaCost;
        this.mana =
          manaCost + this.mana > this.manaMax
            ? this.manaMax
            : this.mana + manaCost;
      }
      this.skills[skill].unlocked = true;
      return { message: `Learned skill: ${this.skills[skill].name}` };
    } else {
      return { message: `Skill ${skill} not found.` };
    }
  }

  useItem(item: string) {
    if (item === 'memory_shard')
      return {
        event: 'memoryshardused',
        message: `You can't use a memory shard.`,
      };
    if (this.items[item] && this.items[item].owned > 0) {
      const itemEffect = this.items[item].effects;
      for (const effect in itemEffect) {
        if (effect === 'health' && this.health < this.healthMax) {
          this.health += itemEffect[effect];
          if (this.health > this.healthMax) {
            this.health = this.healthMax;
          }
          this.items[item].owned--;
          return {
            event: 'itemused',
            message: `You used a ${items[item].name}`,
          };
        } else if (effect === 'mana' && this.mana < this.manaMax) {
          this.mana += itemEffect[effect];
          if (this.mana > this.manaMax) {
            this.mana = this.manaMax;
          }
          this.items[item].owned--;
          return {
            event: 'itemused',
            message: `You used a ${items[item].name}`,
          };
        } else if (effect === 'xp') {
          this.xp += itemEffect[effect];
          if (this.xp >= this.xpToLevel) {
            this.levelUp();
          }
          return {
            event: 'itemused',
            message: `You used a ${items[item].name}`,
          };
        }
        return { event: 'noeffect', message: `${effect} is already at max.` };
      }
      this.items[item].num--;
      return { message: `Used ${this.items[item].name}.` };
    } else {
      return { message: `Item ${item} not found.` };
    }
  }

  castOrbOfDeception(enemies: Enemy[]) {
    if (this.mana >= this.skills.orbofdeception.manaCost) {
      this.mana -= this.skills.orbofdeception.manaCost;
      const damage = this.calculateSpellDamage(this.skills.orbofdeception.damage);
      if (enemies.length > 0) {
        enemies.forEach((enemy) => {
          enemy.health -= damage;
          if (enemy.health <= 0) {
            this.enemyDefeated(enemy);
          }
        });
        return {
          event: 'fight',
          message: `Casted Orb of Deception, hitting ${
            enemies.length > 1 ? enemies.length + ' enemies' : 'an enemy'
          } for ${damage} damage.`,
          enemies: enemies,
        };
      } else {
        return {
          event: 'spellcast',
          message: `Ahri casted Orb of Deception, hitting nothing but grass.`,
          enemies: [],
        };
      }
    } else {
      return {
        event: 'nomana',
        message: `Not enough mana to cast Orb of Deception.`,
        enemies: [],
      };
    }
  }

  castFoxFire(enemies: Enemy[]) {
    if (this.mana >= this.skills.foxfire.manaCost) {
      this.mana -= this.skills.foxfire.manaCost;
      const damage = this.calculateSpellDamage(this.skills.foxfire.damage);
      enemies.forEach((enemy) => {
        enemy.health -= damage;
        if (enemy.health <= 0) {
          this.enemyDefeated(enemy);
          if (this.xp >= this.xpToLevel) {
            this.levelUp();
          }
        }
      });
      return {
        event: 'fight',
        message: `Casted Fox-Fire, inflicting ${damage} damage to ${
          enemies.length
        } ${enemies.length > 1 ? enemies.length + ' enemies' : 'an enemy'}.`,
        enemies: enemies,
      };
    } else {
      return {
        event: 'spellcast',
        message: `Not enough mana to cast Fox-Fire.`,
        enemies: [],
      };
    }
  }

  castCharm(enemy: Enemy) {
    if (this.mana >= this.skills.charm.manaCost) {
      if (enemy.isCharmed) {
        return {
          event: 'alreadycharmed',
          message: `${enemy.name} is already charmed.`,
          enemy: enemy,
        };
      } else if (enemy.level > 3) {
        return {
          event: 'fight',
          message: `${enemy.name} is too high level to be charmed.`,
          enemy: enemy,
        };
      } else {
        this.mana -= this.skills.charm.manaCost;
        enemy.isCharmed = true;
        return {
          event: 'spellcast',
          message: `Casted Charm on ${enemy.name}.`,
          enemy: enemy,
        };
      }
    } else {
      return {
        event: 'spellcast',
        message: `Not enough mana to cast Charm.`,
        enemy: null,
      };
    }
  }

  initSpiritRush() {
    return this.mana >= this.skills.spiritrush.manaCost;
  }

  castSpiritRush(enemies: Enemy[]) {
    const skill = this.skills.spiritrush;
    const damage = this.calculateSpellDamage(skill.damage);
    this.mana -= this.skills.spiritrush.manaCost;
    if (enemies.length > 0) {
      enemies.forEach((enemy) => {
        enemy.health -= damage;
        if (enemy.health <= 0) {
          this.enemyDefeated(enemy);
        }
      });
      return {
        event: 'spellcast',
        message: `Spirit Rush inflicted ${skill.damage} to  ${
          enemies.length > 1 ? enemies.length + ' enemies' : ' an enemy'
        }.`,
        enemies: enemies,
      };
    } else {
      return {
        event: 'noenemies',
        message: `Ahri casted Spirit Rush, hitting nothing but grass.`,
        enemies: [],
      };
    }
  }

  calculateSpellDamage(spellDamage: number) {
    if (this.items["memory_shard"].owned >= 20) {
      return Math.floor(spellDamage * 2);
    } else {
      return spellDamage;
    }
  }
  // Handles essence theft health and mana gain
  // Level up if enough xp is gained
  enemyDefeated(enemy: Enemy) {
    this.xp += enemy.xp;
    if (this.skills.essencetheft.available)
      this.health += Math.floor(enemy.healthMax * 0.1);
    if (this.xp >= this.xpToLevel) {
      this.xp -= this.xpToLevel;
      this.levelUp();
    }
  }

  levelUp() {
    this.level++;
    this.xpToLevel += 100;
    this.health += this.healthPerLevel;
    this.healthMax += this.healthPerLevel;
    this.mana += this.manaPerLevel;
    this.manaMax += this.manaPerLevel;
    this.damageMin += this.damagePerlLevel;
    this.damageMax += this.damagePerlLevel;
  }
}