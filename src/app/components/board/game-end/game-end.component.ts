import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-game-end',
  imports: [NgIf],
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
        animate(
          '0.5s ease-in',
          style({ opacity: 1, transform: 'translate(-50%, -50%)' })
        ),
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
    <div *ngIf="gameOver || gameWon" class="outer-container">
      <div [@fadeIn] class="game-done-overlay"></div>
      <div [@slideIn] class="game-done-container">
        <div class="lost" *ngIf="gameOver">
          <h2>The silence is full of ghostly motion</h2>
          <h2>You can feel the memories slide,</h2>
          <h2>Like tears on the cheeks of the night—</h2>
          <h2>And nobody speaking.</h2>
          <button (click)="onRestart()">Play Again ?</button>
        </div>
        <div class="won" *ngIf="gameWon && !quit">
          <h2>Quick as a fox, Ahri managed to escape</h2>
          <h2>from the clutch of the Noxians</h2>
          <h2>Legends never die, at least not today...</h2>
          <button (click)="onRestart()">Play Again ?</button>
          <button (click)="onQuit()">I'm done</button>
        </div>
        <div *ngIf="quit" class="quit-container">
          <div class="bg-charm"></div>
          <h2>Thanks for playing!</h2>
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
        transform: translate(-50%, -50%);
        background-color: white;
        border-radius: 10px;
        text-align: center;
        z-index: 20;
      }

      .game-done-container .lost {
        background-color: #2c2c2c;
        background-image: url('/images/background/bg-bad-end.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: left;
        text-align: left;
        color: #ff4d4d;
        border: 2px solid #ff4d4d;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
        padding: 20px;
        animation: shake 0.5s ease-in-out;
      }

      .game-done-container .lost h2 {
        font-size: 24px;
        font-weight: bold;
        margin: 10px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
      }

      .game-done-container .lost button {
        padding: 12px 24px;
        margin-top: 20px;
        font-size: 18px;
        font-weight: bold;
        background-color: #ff4d4d;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .game-done-container .lost button:hover {
        background-color: #ff1a1a;
        transform: scale(1.1);
      }

      .game-done-container .won {
        background-color: rgba(
          255,
          255,
          255,
          0.1
        );
        background-image: url('/images/background/bg-good-end.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        text-align: left;
        color: #ff79c6;
        border: 2px solid #ff79c6;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
        padding: 30px;
        border-radius: 15px;
        animation: glow 1.5s infinite alternate;
      }

      .game-done-container .won h2 {
        font-size: 28px;
        font-weight: bold;
        margin: 15px 0;
        text-shadow: 2px 2px 6px rgba(0, 0, 0, 0.8);
      }

      .game-done-container .won button {
        padding: 14px 28px;
        margin-top: 20px;
        margin-right: 10px;
        font-size: 20px;
        font-weight: bold;
        background-color: #ff79c6;
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
      }

      .game-done-container .won button:hover {
        background-color: #ff4db2;
      }

      .game-done-container .quit-container .bg-charm {
        width: 600px;
        height: 400px;
        background-image: url('/images/background/bg-ahri-charm-spirit-blossom.jpg');
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        color: #ff79c6;
        border: 2px solid #ff79c6;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.8);
        padding: 30px;
        border-radius: 15px;
        animation: glow 1.5s infinite alternate;
      }

      /* Glowing animation */
      @keyframes glow {
        from {
          box-shadow: 0 0 15px #ff79c6, 0 0 30px #ff79c6;
        }
        to {
          box-shadow: 0 0 25px #ff4db2, 0 0 50px #ff4db2;
        }
      }
    `,
  ],
})
export class GameEndComponent {
  @Input() gameOver: boolean = false;
  @Input() gameWon: boolean = false;
  @Output() restart = new EventEmitter<void>();
  quit = false;

  onRestart() {
    this.restart.emit();
  }

  onQuit() {   
    this.quit = true;
  }
}