import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, inject, Input } from '@angular/core';
import { GameEndComponent } from './game-end/game-end.component';
import { PlayerSidebarComponent } from './player-sidebar/player-sidebar.component';
import { MapService } from '../../app/services/map.service';
import { PlayerService } from '../..//app/services/player.service';
import { enemies } from '../../../../public/data/enemies';
import { skills } from '../../../../public/data/skills';
import { items } from '../../../../public/data/items';

@Component({
  selector: 'app-board',
  imports: [NgFor, NgIf, GameEndComponent, PlayerSidebarComponent],
  template: `
    <div class="outer-container">
      <app-game-end
        [gameOver]="gameOver"
        [gameWon]="gameWon"
        (restart)="restartGame()"
      />

      <app-player-sidebar
        [logs]="consoleLogs"
        (useItem)="useItem($event)"
        (selectSpell)="selectSpell($event)"
      />

      <h1>{{ title }}</h1>
      <div class="spell-cast-container">
        <div class="spell-cast-content" *ngIf="selectedSpell">
          <h2>Selected spell: {{ selectedSpell.name }}</h2>
          <button (click)="clearSpellRange()">Cancel</button>
        </div>
      </div>
      <div class="map-container">
        <div
          *ngIf="mapReady"
          class="map"
          [style.transform]="
            'translateY(-' + mapService.mapParams.cellSize * offset + 'px)'
          "
        >
          <div *ngFor="let row of mapService.map" class="map-row">
            <div
              *ngFor="let cell of row"
              class="map-cell"
              [class]="{
                visible: cell.visible,
                empty: cell.state === 'empty',
                player: cell.state === 'player',
                wall: cell.state === 'wall',
                infantryman: cell.state === 'infantryman',
                infantryman_ischarmed: cell.state === 'infantryman_ischarmed',
                sion_0: cell.state === 'sion_0',
                path: cell.state === 'path' && debugMode,
                memoryShard: cell.state === 'memory_shard',
                healthPotion: cell.state === 'health_potion',
                manaPotion: cell.state === 'mana_potion',
                essencetheft: cell.state === 'essencetheft',
                orbofdeception: cell.state === 'orbofdeception',
                foxfire: cell.state === 'foxfire',
                charm: cell.state === 'charm',
                spiritRush: cell.state === 'spiritrush',
              }"
            >
              <div
                class="spell-range"
                *ngIf="cell.inSpellRange"
                (click)="castSpellOnCell(cell.posX, cell.posY)"
              ></div>
              <div class="cell-overlay" [class.visible]="cell.visible"></div>
              <div class="cell-content">
                <p *ngIf="this.debugMode"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .outer-container {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background-image: url('/images/background/bg-akana-forest.jpg');
      }

      h1 {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        margin: 20px;
        padding: 10px;
        color: pink;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
      }

      .spell-cast-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 50px;
        padding: 0 10px;
      }

      .spell-cast-content {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 10px;
        padding: 8px;
        color: white;
      }

      .spell-cast-content h2 {
        margin: 0;
        padding: 0 10px;
      }

      .spell-cast-content button {
        margin-left: 10px;
        padding: 5px 10px;
        background-color: grey;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }

      .map-container {
        height: 650px;
        width: 1000px;
        overflow: hidden;
        margin: 0 auto;
        outline: 4px solid #966f33;
        border-radius: 10px;
      }

      .map {
        background: linear-gradient(
          to bottom,
          red,
          purple,
          indigo,
          forestgreen,
          grey
        );
        overflow: hidden;
      }

      .map-row {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
      }

      .map-cell {
        position: relative;
        width: var(--cellSize);
        height: var(--cellSize);
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
      }

      .map-cell .cell-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 1);
        transition: background-color 0.3s ease;
        z-index: 10;
      }

      .map-cell .cell-overlay.visible {
        background-color: rgba(0, 0, 0, 0);
      }

      .map-cell .spell-range {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(68, 0, 255, 0.2);
        z-index: 100;
        cursor: pointer;
      }

      .map-cell .cell-content {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-size: cover;
        transition: border 0.3s ease;
      }

      .map-cell.player .cell-content {
        background-image: url('/images/player/AhriPortrait_mini.png');
        border-radius: 50%;
      }

      .map-cell.wall .cell-content {
        background-color: rgb(39, 11, 11);
      }

      .map-cell.infantryman .cell-content {
        background-image: url('/images/enemies/infantryman_mini.png');
        background-color: red;
        border: 1px solid red;
      }

      .map-cell.infantryman_ischarmed .cell-content {
        background-image: url('/images/enemies/infantryman_mini.png');
        background-color: #ff00bf;
        border: 2px solid #ff00bf;
      }

      .map-cell.sion_0 .cell-content {
        position: absolute;
        box-sizing: border-box;
        top: 0;
        left: 0;
        width: calc(var(--cellSize) * 2);
        height: calc(var(--cellSize) * 2);
        background-image: url('/images/enemies/sion.png');
        border: 4px red solid;
        z-index: 100;
      }

      .map-cell.memoryShard .cell-content {
        position: relative;
        background-image: url('/images/items/memory_shard.png');
        background-position: center;
        background-size: 50%;
        background-repeat: no-repeat;
        z-index: 1;
      }

      .map-cell.memoryShard .cell-content::after {
        content: ' ';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 65%;
        height: 65%;
        background-color: #00acc1;
        border-radius: 50%;
        filter: blur(5px);
        opacity: 0.5;
        z-index: -1;
      }

      .map-cell.empty .cell-content {
        background-color: transparent;
      }

      .map-cell.wall .cell-content {
        background-color: rgb(39, 11, 11);
      }

      .map-cell.healthPotion .cell-content,
      .map-cell.manaPotion .cell-content,
      .map-cell.essencetheft .cell-content,
      .map-cell.orbofdeception .cell-content,
      .map-cell.foxfire .cell-content,
      .map-cell.charm .cell-content,
      .map-cell.spiritRush .cell-content {
        background-size: cover;
      }

      .map-cell.healthPotion .cell-content {
        background-image: url('/images/items/health_potion.png');
      }

      .map-cell.manaPotion .cell-content {
        background-image: url('/images/items/mana_potion.png');
      }

      .map-cell.essencetheft .cell-content {
        background-image: url('/images/player/skills/essence_theft.png');
      }

      .map-cell.orbofdeception .cell-content {
        background-image: url('/images/player/skills/orb_of_deception.png');
      }

      .map-cell.foxfire .cell-content {
        background-image: url('/images/player/skills/fox_fire.png');
      }

      .map-cell.charm .cell-content {
        background-image: url('/images/player/skills/charm.png');
      }

      .map-cell.spiritRush .cell-content {
        background-image: url('/images/player/skills/spirit_rush.png');
      }

      .map-cell.path .cell-content {
        background-color: yellow; /* Highlight path for debugging */
      }
    `,
  ],
})
export class BoardComponent {
  @Input() title!: string;
  
  mapService = inject(MapService);
  playerService = inject(PlayerService);
  enemies = enemies;
  consoleLogs: { event: string; message: string }[] = [];

  
  visibleHeight = 650;
  visionDistance = 2;
  mapReady: boolean = false;
  selectedSpell: { name: string; id: string } | null = null;
  spellRangeCells: { x: number; y: number }[] = [];
  debugMode: boolean = false;
  offset = 0;

  aquiredSkills: { name: string; description: string; image: string }[] = [];
  gameStarted = true;
  gameOver = false;
  gameWon = false;

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (
      this.gameStarted &&
      !this.gameOver &&
      !this.gameWon &&
      this.selectedSpell === null
    ) {
      switch (event.key) {
        case 'ArrowUp':
          this.movePlayer(0, -1);
          break;
        case 'ArrowDown':
          this.movePlayer(0, 1);
          break;
        case 'ArrowLeft':
          this.movePlayer(-1, 0);
          break;
        case 'ArrowRight':
          this.movePlayer(1, 0);
          break;
        case 'F1':
          this.debugMode = !this.debugMode;
          // Unlock all skills
          this.playerService.itemsList.forEach(item => {
            this.playerService.items[item].owned = 20;
            
          });
          this.playerService.skillsList.forEach((skill) => {
            this.playerService.skills[skill].unlocked = true; 
          });
          // Reveal all cells
          for (let row = 0; row < this.mapService.mapParams.rows; row++) {
            for (let col = 0; col < this.mapService.mapParams.cols; col++) {
              this.mapService.map[row][col].visible = true;
            }
          }
          break;
        case 'F2':
          if (this.debugMode) this.gameOver = true; // Simulate game over for testing
          break;
        case 'F3':
          if (this.debugMode) this.gameWon = true; // Simulate game won for testing
          break;
        case 'F4':
          if (this.debugMode) this.movePlayerToCell(9, 7);
          break;
      }
    }
  }

  ngOnInit() {
    this.generateNewGame();
  }

  generateNewGame() {
    this.mapService.generateMap();
    this.mapService.initializePlayerPosition(this.visibleHeight);
    this.mapService.createPath();
    this.mapService.generateEnemies();
    this.mapService.generateSion();
    this.mapService.distributeItems();
    this.mapService.distributeSkills();
    this.calculateOffset();
    this.calculateVisibleCells();
    this.mapReady = true;
  }

  restartGame() {
    this.gameOver = false;
    this.gameWon = false;
    this.debugMode = false;
    this.generateNewGame();
    this.playerService.resetPlayerStats();
    this.consoleLogs = [];
  }

  calculateOffset() {
    const playerRow = this.mapService.player.posY;
    const rowsTotal = this.mapService.mapParams.rows;
    const visibleHeight = this.visibleHeight;
    const visibleCells = Math.floor(
      visibleHeight / this.mapService.mapParams.cellSize
    );
    if (
      this.mapService.player.posY <
      rowsTotal - Math.floor(visibleCells / 2)
    ) {
      this.offset = playerRow - Math.floor(visibleCells / 2);
    } else {
      this.offset = rowsTotal - visibleCells;
    }
  }

  calculateVisibleCells() {
    const playerRow = this.mapService.player.posY;
    const playerCol = this.mapService.player.posX;
    const distance = this.visionDistance;

    for (let row = playerRow - distance; row <= playerRow + distance; row++) {
      if (row < 0 || row >= this.mapService.mapParams.rows) continue;
      for (let col = playerCol - distance; col <= playerCol + distance; col++) {
        if (col < 0 || col >= this.mapService.mapParams.cols) continue;
        this.mapService.map[row][col].visible = true;
      }
    }
  }

  movePlayer(deltaX: number, deltaY: number) {
    const newPosX = this.mapService.player.posX + deltaX;
    const newPosY = this.mapService.player.posY + deltaY;

    if (
      newPosX < 0 ||
      newPosX >= this.mapService.mapParams.cols ||
      newPosY < 0 ||
      newPosY >= this.mapService.mapParams.rows ||
      this.mapService.map[newPosY][newPosX].state === 'wall'
    ) {
      if (!this.debugMode) return; // Prevent moving out of bounds
    }

    const cellType = this.mapService.map[newPosY][newPosX].state;
    let obstacle = false;
    if (cellType.startsWith("infantryman") || cellType.startsWith("sion")) {
      const enemy =
        cellType.startsWith("sion")
          ? this.findLargeEnemies(newPosX, newPosY)
          : this.mapService.enemies.find(
              (enemy) => enemy.posX === newPosX && enemy.posY === newPosY
            );
      if (enemy) {
        const fightResult = this.playerService.fightEnemy(enemy);
        if (fightResult.status === 'defeated') {
          obstacle = true;
          this.consoleLogs.unshift({
            event: 'fight',
            message: fightResult.message,
          });
          this.gameOver = true;
          return;
        } else if (fightResult.status === 'victory') {
          this.mapService.map[newPosY][newPosX].state = 'empty';
          this.removeDefeatedEnemies(enemy);
        } else if (fightResult.status === 'draw') {
          obstacle = true;
          this.consoleLogs.unshift({
            event: 'fight',
            message: fightResult.message,
          });
        }
      }

      // Handle picking up items
    } else if (Object.keys(items).includes(cellType)) {
      this.pickUpItem(cellType);
      // Handle learning skills
    } else if (Object.keys(skills).includes(cellType)) {
      this.pickUpSkill(cellType);
    }
    if (obstacle) return;
    // Move player to new position
    this.movePlayerToCell(newPosX, newPosY);

    // Trigger game over if player reaches the top of the map
    if (newPosY === 0) {
      this.gameWon = true;
    }
  }

  movePlayerToCell(x: number, y: number) {
    // Clean up the previous cell
    const prevX = this.mapService.player.posX;
    const prevY = this.mapService.player.posY;
    this.mapService.map[prevY][prevX].state = 'empty';

    // Update the player's position
    this.mapService.player.posX = x;
    this.mapService.player.posY = y;

    // Update the new cell to be the player and mark the surrounding cells as visible
    this.mapService.map[y][x].state = 'player';

    this.calculateOffset();
    this.calculateVisibleCells();
  }

  useItem(item: string) {
    const result = this.playerService.useItem(item);
    if (result.event === 'itemused') {
      this.consoleLogs.unshift({ event: 'itemused', message: result.message });
    }
  }

  selectSpell(spell: string) {
    if (spell === 'essencetheft') return; // Prevent selecting passive skill
    const checkMana = this.playerService.checkSpellManaCost(spell)
    
    // Check if the player has enough mana to cast the spell
    if (checkMana.event === "nomana") {
      this.consoleLogs.unshift({
        event: checkMana.event,
        message: checkMana.message,
      });
      return;
    }
    this.clearSpellRange(); // Clear previous spell range
    this.selectedSpell = {
      name: this.playerService.skills[spell].name,
      id: spell,
    };

    const playerX = this.mapService.player.posX;
    const playerY = this.mapService.player.posY;

    // Define the range for each spell
    const range = this.playerService.skills[spell].range;

    // Highlight cells in a straight line (no diagonal)
    if (spell === 'foxfire') {
      const markedCells = [
        { dx: -1, dy: 1 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: -1 },
        { dx: -1, dy: 0 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: -1 },
        { dx: 0, dy: -1 },
        { dx: 1, dy: 1 },
      ];
      markedCells.forEach(({ dx, dy }) => {
        const targetX = playerX + dx;
        const targetY = playerY + dy;
        if (
          targetX >= 0 &&
          targetX < this.mapService.mapParams.cols &&
          targetY >= 0 &&
          targetY < this.mapService.mapParams.rows
        ) {
          this.mapService.map[targetY][targetX].inSpellRange = true;
          this.spellRangeCells.push({ x: targetX, y: targetY });
        }
      });
    } else {
      for (let i = 1; i <= range; i++) {
        if (playerX + i < this.mapService.mapParams.cols) {
          this.mapService.map[playerY][playerX + i].inSpellRange = true; // Right
          this.spellRangeCells.push({ x: playerX + i, y: playerY });
        }
        if (playerX - i >= 0) {
          this.mapService.map[playerY][playerX - i].inSpellRange = true; // Left
          this.spellRangeCells.push({ x: playerX - i, y: playerY });
        }
        if (playerY + i < this.mapService.mapParams.rows) {
          this.mapService.map[playerY + i][playerX].inSpellRange = true; // Down
          this.spellRangeCells.push({ x: playerX, y: playerY + i });
        }
        if (playerY - i >= 0) {
          this.mapService.map[playerY - i][playerX].inSpellRange = true; // Up
          this.spellRangeCells.push({ x: playerX, y: playerY - i });
        }
      }
    }
  }

  castSpellOnCell(x: number, y: number) {
    if (!this.selectedSpell) return; // No spell selected

    const playerX = this.mapService.player.posX;
    const playerY = this.mapService.player.posY;
    const range = this.playerService.skills.orbofdeception.range;

    if (this.selectedSpell.id === 'orbofdeception') {
      const targetedCells: { x: number; y: number }[] = this.getLineCells(
        x,
        y,
        playerX,
        playerY,
        range
      );

      const enemies = this.getEnemiesInRange(targetedCells);
      const result = this.playerService.castOrbOfDeception(enemies);
      this.consoleLogs.unshift({
        event: result.event,
        message: result.message,
      });
      if (result.event !== 'nomana') {
        // Destroy walls in the path of the spell and gives vision
        targetedCells.forEach(({ x, y }) => {
          this.mapService.map[y][x].visible = true;
          if (this.mapService.map[y][x].state === 'wall') {
            this.mapService.map[y][x].state = 'empty';
          }
        });
        if (result.enemies && result.enemies.length > 0) {
          result.enemies.forEach((enemy) => {
            if (typeof enemy.posX === "number" && typeof enemy.posY === "number") {
              if (enemy.health <= 0) {
                // Remove defeated enemy
                this.removeDefeatedEnemies(enemy);
              }
            }
          });
        }
      }
    } else if (this.selectedSpell.id === 'foxfire') {
      // Look for enemies in the selected cells
      const enemies = this.getEnemiesInRange(this.spellRangeCells);
      if (enemies.length > 0) {
        const result = this.playerService.castFoxFire(enemies);
        this.consoleLogs.unshift({
          event: result.event,
          message: result.message,
        });
        // Update the map to show the spell effect
        if (result.enemies && result.enemies.length > 0) {
          result.enemies.forEach((enemy) => {
            if (typeof enemy.posX === "number" && typeof enemy.posY === "number") {
              if (enemy.health <= 0) {
                // Remove defeated enemy
                this.removeDefeatedEnemies(enemy);
              }
            }
          });
        }
      } else {
        this.consoleLogs.unshift({
          event: 'spellcast',
          message: 'No enemies in range.',
        });
      }
    } else if (this.selectedSpell.id === 'charm') {
      const targetedCells: { x: number; y: number }[] = this.getLineCells(
        x,
        y,
        this.mapService.player.posX,
        this.mapService.player.posY,
        4
      );
      // Look for enemies in the selected cells
      const enemies = this.getEnemiesInRange(targetedCells);
      // Find the closest enemy in the selected cells
      if (enemies.length > 0) {
        const closestEnemy = enemies.reduce((closest: any, enemy) => {
          if (enemy.posY && enemy.posX && closest.posY && closest.posX) {
            const distanceToCurrent =
              Math.abs(enemy.posX - playerX) + Math.abs(enemy.posY - playerY);
            const distanceToClosest =
              Math.abs(closest.posX - playerX) +
              Math.abs(closest.posY - playerY);
            return distanceToCurrent < distanceToClosest ? enemy : closest;
          }
        }, enemies[0]);

        const result = this.playerService.castCharm(closestEnemy);
        this.consoleLogs.unshift({
          event: 'spellcast',
          message: result.message,
        });
        if (result.event !== 'nomana') {
          if (closestEnemy.posY && closestEnemy.posX) {
            this.mapService.map[closestEnemy.posY][closestEnemy.posX].state =
              'infantryman_ischarmed';
          }
        }
      } else {
        this.consoleLogs.unshift({
          event: 'spellcast',
          message: 'No enemies in range.',
        });
      }
    } else if (this.selectedSpell.id === 'spiritrush') {
      // Check targeted cell
      const cellType = this.mapService.map[y][x].state;
      if (['empty', 'path'].includes(cellType)) {
        const prevX = this.mapService.player.posX;
        const prevY = this.mapService.player.posY;
        this.movePlayerToCell(x, y);
        this.calculateVisibleCells();

        // Calculate the path traveled
        const pathCells = this.getPathCells(prevX, prevY, x, y);

        // Get all cells within 1-tile distance of the path
        const surroundingCells = this.getSurroundingCells(pathCells);

        // Find enemies in the surrounding cells
        const enemies = this.getEnemiesInRange(surroundingCells);
        const result = this.playerService.castSpiritRush(enemies);
        // Update the map to show the spell effect
        if (result.enemies) {
          result.enemies.forEach((enemy) => {
            if (typeof enemy.posX === "number" && typeof enemy.posY === "number") {
              if (enemy.health <= 0) {
                this.removeDefeatedEnemies(enemy);
              }
            }
          });
        }
      } else if (Object.keys(items).includes(cellType)) {
        this.consoleLogs.unshift({
          event: 'spellcast',
          message: 'Ahri casted Spirit Rush and collected an item!',
        });
        this.pickUpItem(cellType);
        this.movePlayerToCell(x, y);
      } else if (Object.keys(skills).includes(cellType)) {
        this.consoleLogs.unshift({
          event: 'spellcast',
          message: 'Ahri casted Spirit Rush and learned a new skill!',
        });
        this.pickUpSkill(cellType);
        this.movePlayerToCell(x, y);
      } else {
        this.consoleLogs.unshift({
          event: 'invalidinput',
          message:
            'Spirit Rush can only target an empty cell or an obtainable.',
        });
      }
    }
    this.clearSpellRange();
  }

  getPathCells(startX: number, startY: number, endX: number, endY: number) {
    const pathCells: { x: number; y: number }[] = [];

    if (startX === endX) {
      // Vertical movement
      const step = startY < endY ? 1 : -1;
      for (let y = startY; y !== endY + step; y += step) {
        pathCells.push({ x: startX, y });
      }
    } else if (startY === endY) {
      // Horizontal movement
      const step = startX < endX ? 1 : -1;
      for (let x = startX; x !== endX + step; x += step) {
        pathCells.push({ x, y: startY });
      }
    }

    return pathCells;
  }

  getSurroundingCells(pathCells: { x: number; y: number }[]) {
    const surroundingCells: { x: number; y: number }[] = [];

    pathCells.forEach(({ x, y }) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const newX = x + dx;
          const newY = y + dy;

          // Ensure the cell is within map bounds
          if (
            newX >= 0 &&
            newX < this.mapService.mapParams.cols &&
            newY >= 0 &&
            newY < this.mapService.mapParams.rows
          ) {
            surroundingCells.push({ x: newX, y: newY });
          }
        }
      }
    });

    // Remove duplicate cells
    return surroundingCells.filter(
      (cell, index, self) =>
        index === self.findIndex((c) => c.x === cell.x && c.y === cell.y)
    );
  }

  getSpellDirection(x: number, y: number, playerX: number, playerY: number) {
    const xDirection = x > playerX ? 1 : -1;
    const yDirection = y > playerY ? 1 : -1;
    if (x === playerX) {
      return yDirection === 1 ? 'down' : 'up';
    } else if (y === playerY) {
      return xDirection === 1 ? 'right' : 'left';
    }
    return null; // No valid direction
  }

  getLineCells(
    x: number,
    y: number,
    playerX: number,
    playerY: number,
    range: number
  ) {
    const result = [];
    const direction = this.getSpellDirection(x, y, playerX, playerY);
    switch (direction) {
      case 'up':
        for (let i = 1; i <= range; i++) {
          if (playerY - i < 0) {
            break;
          } else {
            result.push({
              x: playerX,
              y: playerY - i,
            });
          }
        }
        break;
      case 'right':
        for (let i = 1; i <= range; i++) {
          if (playerX + i > this.mapService.mapParams.cols - 1) {
            break;
          } else {
            result.push({
              x: playerX + i,
              y: playerY,
            });
          }
        }
        break;
      case 'down':
        for (let i = 1; i <= range; i++) {
          if (playerY + i > this.mapService.mapParams.rows - 1) {
            break;
          } else {
            result.push({
              x: playerX,
              y: playerY + i,
            });
          }
        }
        break;
      case 'left':
        for (let i = 1; i <= range; i++) {
          if (playerX - i < 0) {
            break;
          } else {
            result.push({
              x: playerX - i,
              y: playerY,
            });
          }
        }
        break;
    }
    return result;
  }

  getEnemiesInRange(cells: { x: number; y: number }[]) {
    const normalEnemies = this.mapService.enemies.filter((enemy) =>
      cells.some((cell) => cell.x === enemy.posX && cell.y === enemy.posY)
    );

    const largeEnemies = this.mapService.largeEnemies.filter((enemy) => {
      const size = enemy.size;
      const x = enemy.posX;
      const y = enemy.posY;

      // Check if any cell overlaps with the large enemy's area
      return cells.some(
        (cell) =>
          cell.x >= x && cell.x < x + size && cell.y >= y && cell.y < y + size
      );
    });

    const result = normalEnemies.concat(largeEnemies);
    return result;
  }

  findLargeEnemies(newPosX: number, newPosY: number) {
    const hitEnemy = this.mapService.largeEnemies.find((enemy) => {
      const size = enemy.size;
      const x = enemy.posX;
      const y = enemy.posY;

      // Check if the hit cell is within the bounds of the large enemy
      return (
        newPosX >= x && newPosX < x + size && newPosY >= y && newPosY < y + size
      );
    });

    if (hitEnemy) {
      return hitEnemy;
    } else {
      return null; // No large enemy hit, something must be wrong with that enemy spawning
    }
  }

  removeDefeatedEnemies(enemy: any) {
    this.mapService.map[enemy.posY][enemy.posX].state = 'empty';
    this.mapService.enemies = this.mapService.enemies.filter(
      (e) => e !== enemy
    );
    // Clear the cells occupied by large enemies
    if (enemy.size > 1) {
      for (let i = 0; i < enemy.size; i++) {
        for (let j = 0; j < enemy.size; j++) {
          this.mapService.map[enemy.posY + j][enemy.posX + i].state = 'empty';
        }
      }
    }
    this.consoleLogs.unshift({
      event: 'fightwon',
      message: `You defeated ${enemy.name} and gained ${enemy.xp} XP.`,
    });
  }

  clearSpellRange() {
    this.selectedSpell = null;
    this.spellRangeCells.forEach(({ x, y }) => {
      this.mapService.map[y][x].inSpellRange = false;
    });
    this.spellRangeCells = []; // Clear the spell range cells
  }

  pickUpItem(item: string) {
    const result = this.playerService.collectItem(item);
    this.consoleLogs.unshift({
      event: 'itemobtained',
      message: result.message,
    });
  }

  pickUpSkill(skill: string) {
    const skillResult = this.playerService.learnSkill(skill);
    this.consoleLogs.unshift({
      event: 'skilllearnt',
      message: skillResult.message,
    });
  }
}