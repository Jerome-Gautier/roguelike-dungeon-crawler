import { Injectable } from '@angular/core';

import { Enemy, enemies } from '../../../../public/data/enemies';
import { skills } from '../../../../public/data/skills';
import { items } from '../../../../public/data/items';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  map: { posX: number; posY: number; state: string; visible: boolean, inSpellRange: boolean }[][] = [];
  mapParams = {
    cellSize: 50,
    cols: 20,
    rows: 100,
    startingRow: 5,
    enemiesCount: 50,
    easy: false,
  };
  visionParams = {
    distance: 3,
  };
  enemiesList: string[] = Object.keys(enemies);
  enemies: Enemy[] = [];
  largeEnemies: Enemy[] = [];
  player = {
    posX: 10,
    posY: 3,
  };
  skillsList = Object.keys(skills);

  generateMap() {
    this.map = Array.from({ length: this.mapParams.rows }, (_, rowIndex) =>
      Array.from({ length: this.mapParams.cols }, (_, colIndex) => ({
        posX: colIndex,
        posY: rowIndex,
        state: Math.random() > 0.8 ? 'empty' : 'wall',
        visible: false,
        inSpellRange: false,
      }))
    );
  }

  createPath() {
    let currentX = Math.floor(Math.random() * (this.mapParams.cols - 1));
    let row = 0;
    let x = this.player.posX;
    let y = this.player.posY;

    while (row <= y) {
      if (this.map[row][currentX].state === 'player') return; // Stop if the player is reached

      let diceRoll = Math.random();
      
      this.map[row][currentX].state = 'path'; // Mark the current cell as part of the path

      if (diceRoll <= 0.33 && currentX > 0) {
        currentX--; // Move left
        this.map[row][currentX].state = 'path';
      } else if (diceRoll >= 0.66 && currentX < this.mapParams.cols - 1) {
        currentX++; // Move right
        this.map[row][currentX].state = 'path';
      } else {
        this.map[row][currentX].state = 'path'; // Stay in the same column
      }

      // Check if path reached player's position, if not path will move to his axis
      if (row === y) {
        if (x !== currentX) {
          const distance = x - currentX;
          for (let i = 0; i < Math.abs(distance); i++) {
            if (distance > 0) {
              this.map[row][currentX + i].state = 'path';
            } else {
              this.map[row][currentX - i].state = 'path';
            }
          }
          break; // Exit the loop if the player is reached
        }
      }
      if (Math.random() < 0.7) row++;
    }
  }

  initializePlayerPosition(visibleHeight: number) {
    const rowsTotal = this.mapParams.rows;
    const visibleCells = Math.floor(visibleHeight / this.mapParams.cellSize);
    this.player.posX = Math.floor(this.mapParams.cols / 2);
    this.player.posY = rowsTotal - Math.floor(visibleCells / 2);
    this.map[this.player.posY][this.player.posX].state = 'player'; // Mark the player's position on the map
  }

  generateEnemies(enemiesCount: number = this.mapParams.enemiesCount) {
    let map = this.map;
    let mapParams = this.mapParams;
    let row = this.mapParams.startingRow;
    let encounterChance = 0.1;

    while (row < mapParams.rows - 1) {
      if (Math.random() < encounterChance) {
        const x = Math.floor(Math.random() * mapParams.cols);
        const y = row;

        const nearestPathCell = this.findNearestPathCell(x, y);
        if (nearestPathCell) {
          // Create a direct path to the nearest path cell
          this.createDirectPath(x, y, nearestPathCell.x, nearestPathCell.y);
          if (map[y][x].state === 'empty' || map[y][x].state === 'wall') {
            this.addEnemy(map, x, y, "infantryman");
            enemiesCount--;
            encounterChance = 0.1;
          }
        }
        encounterChance += 0.1;
      }
      if (enemiesCount <= 0) break;
      row++;
    }
    if (enemiesCount > 0) {
      this.generateEnemies(enemiesCount); // Recursively generate more enemies if needed
    }
  }

  generateSion() {
    const sionData = enemies['sion'];
    const size = sionData.size;
    const startX = Math.floor(this.mapParams.cols / 2 - size / 2);
    const endX = Math.floor(startX + size / 2);
    const startY = 0;
    const endY = size - 1;
    this.addEnemy(this.map, startX, startY, 'sion');
    const sionCells = [];
    for (let i = startX; i <= endX; i++) {
      for (let j = startY; j <= endY; j++) {
        sionCells.push({ x: i, y: j });
      }
    }
    // Mark the cells for the Sion
    sionCells.forEach((cell) => {
      this.map[cell.y][cell.x].state = `sion`;
    });

    // Make a wall on the left side of the Sion
    for (let i = 0; i < startX; i++) {
      for (let j = 0; j < size; j++) {
        this.map[j][i].state = 'wall';
      }
    }

    // Make a wall on the right side of the Sion
    for (let i = endX + 1; i < this.mapParams.cols; i++) {
      for (let j = 0; j < size; j++) {
        this.map[j][i].state = 'wall';
      }
    }

    // Clear the cells in front of the Sion
    for (let i = startX; i <= endX; i++) {
      for (let j = size; j < size + 1; j++) {
        this.map[j][i].state = 'empty';
      }
    }

    // Make sure the boss is on the path
    let sionX = Math.random() < 0.5 ? startX + 1 : endX - 1;
    let sionY = size;
    const nearestPathCell = this.findNearestPathCell(sionX, sionY);
    if (nearestPathCell) {
      this.createDirectPath(sionX, sionY, nearestPathCell.x, nearestPathCell.y);
    }
  }

  distributeItems() {
    const itemsList = Object.keys(items);
    for (let i = 0; i < itemsList.length; i++) {
      const rowMin = this.mapParams.startingRow;
      const rowMax = this.mapParams.rows - 1;
      let item = itemsList[i];
      let itemCount = items[item].num; // Number of items to distribute
      while (itemCount > 0) {
        const x = Math.floor(Math.random() * this.mapParams.cols);
        const y = Math.floor(Math.random() * (rowMax - rowMin) + rowMin);

        const nearestPathCell = this.findNearestPathCell(x, y);
        if (nearestPathCell) {
          this.createDirectPath(x, y, nearestPathCell.x, nearestPathCell.y);
        }
        if (['empty', 'wall'].includes(this.map[y][x].state)) {
          this.map[y][x].state = itemsList[i];
          this.map[y][x].visible = this.mapParams.easy && true;; // Mark the item as visible
          itemCount--;
        }
      }
    }
  }

  distributeSkills() {
    const skillsList = Object.keys(skills);
    const skillsCount = skillsList.length;

    let sectionSize = Math.floor((this.mapParams.rows - 20) / skillsCount);
    let rowMin = this.mapParams.rows - sectionSize;
    let rowMax = this.mapParams.rows - 1;
    skillsList.forEach((skill) => {
      let distributed = false;
      while (!distributed) {
        const row = Math.floor(Math.random() * (rowMax - rowMin) + rowMin);
        const col = Math.floor(Math.random() * this.mapParams.cols);

        const nearestPathCell = this.findNearestPathCell(col, row);
        if (nearestPathCell) {
          this.createDirectPath(col, row, nearestPathCell.x, nearestPathCell.y);
        }
        if (['empty', 'wall'].includes(this.map[row][col].state)) {
          this.map[row][col].state = skill;
          this.map[row][col].visible = this.mapParams.easy && true; // Mark the skill as visible
          distributed = true; // Mark as distributed
          
          // Updating rowMin and rowMax for the next skill
          rowMin = rowMin - sectionSize;
          rowMax = rowMax - sectionSize;
        }
      }
    });
  }

  addEnemy(map: any, x: number, y: number, enemyType: string) {
    const enemyData = enemies[enemyType];
    const enemy = { ...enemyData, posX: x, posY: y };

    if (map[y][x].state === 'memoryshard') {
      console.warn(`Overwriting memoryshard with enemy at (${x}, ${y})`);
    }
    
    map[y][x].state = enemyType;
    enemyData.size === 1 ? this.enemies.push(enemy) : this.largeEnemies.push(enemy);
  }

  findNearestPathCell(startX: number, startY: number) {
    let minDistance = Infinity;
    let nearestCell: { x: number; y: number } | null = null;
    

    for (let row = 0; row < this.mapParams.rows; row++) {
      for (let col = 0; col < this.mapParams.cols; col++) {
        if (this.map[row][col].state === 'path') {
          const distance = Math.abs(startX - col) + Math.abs(startY - row);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCell = { x: col, y: row };
          }
        }
      }
    }

    return nearestCell;
  }

  createDirectPath(
    startX: number,
    startY: number,
    targetX: number,
    targetY: number
  ) {
    let currentX = startX;
    let currentY = startY;

    while (currentX !== targetX || currentY !== targetY) {
      if (currentX < targetX) {
        currentX++;
      } else if (currentX > targetX) {
        currentX--;
      } else if (currentY < targetY) {
        currentY++;
      } else if (currentY > targetY) {
        currentY--;
      }

      // Mark the cell as part of the path
      if (["empty", "wall"].includes(this.map[currentY][currentX].state)) {
        if (this.map[currentY][currentX].state === 'memory_shard') {
          console.warn(`Overwriting memoryshard with path at (${currentX}, ${currentY})`);
        }
        this.map[currentY][currentX].state = 'path';
        if (Math.random() < 0.1) {
          this.addEnemy(this.map, currentX, currentY, "infantryman"); // Add an enemy with a 10% chance
        }
      }
    }
  }
}