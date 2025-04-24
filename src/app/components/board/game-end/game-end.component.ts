import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-game-end',
  imports: [NgIf, NgClass],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 })),
      ]),
    ]),
    trigger('fadeOut', [
      // Define the fade-out animation here
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, 50%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translate(-50%, -50%)' })),
      ]),
    ]),
    trigger('slideOut', [
      // Define the slide-in animation here
    ]),
    trigger('slideOut', [
      // Define the slide-out animation here
    ]),

  ],
  standalone: true,
  template: `
    <div *ngIf="gameOver || gameWon"  class="outer-container">
      <div class="game-done-overlay" [@fadeIn]></div>
      <div class="game-done-container" [@slideIn] [ngClass]="{ 'lost': gameOver, 'won': gameWon }">
        <h2 *ngIf="gameOver">Don't give up, Skeleton!</h2>
        <h2 *ngIf="gameWon">You are Winner, Congraturation!</h2>
        <button (click)="onRestart()">Play Again ?</button>
      </div>
    </div>
  `,
  styles: [
    `
      .game-done-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
      }

      .game-done-container {
        position: absolute;
        top: 40%;
        left: 50%;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        width: 350px;
        height: 200px;
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 10px;
        text-align: center;
        z-index: 20;
      }

      .game-done-container h2 {
        color: #fff;
        font-size: 40px;
      }

      .game-done-container button {
        padding: 10px 20px;
        font-size: 16px;
        background-color: #007bff;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .game-done-container button:hover {
        background-color: #0056b3;
      }

      .game-done-container.lost {
        background-color: red;
      }

      .game-done-container.won {
        background-color: green;
      }
    `,
  ],
})
export class GameEndComponent {
  @Input() gameOver: boolean = false;
  @Input() gameWon: boolean = false;
  @Output() restart = new EventEmitter<void>();

  onRestart() {
    this.restart.emit();
  }
}