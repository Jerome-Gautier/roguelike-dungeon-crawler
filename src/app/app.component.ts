import { Component } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { StartscreenComponent } from './components/startscreen/startscreen.component';
import {
  animate,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [BoardComponent, StartscreenComponent, NgIf],
  standalone: true,
  animations: [
    trigger('componentTransition', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.8 }),
        animate('0.5s ease-out', style({ opacity: 1, scale: 1 })),
      ]),
      transition(':leave', [
        animate('0.5s ease-in', style({ opacity: 0, scale: 0.8, transform: 'translateY(-100%)' })),
      ]),
    ]),
  ],
  template: `
    <ng-container *ngIf="!gameStarted; else board">
      <app-startscreen
        @componentTransition
        (startGame)="startGame()"
        [title]="title"
      ></app-startscreen>
    </ng-container>
    <ng-template #board>
      <app-board @componentTransition [title]="title"></app-board>
    </ng-template>
  `,
  styles: [
    `
      app-startscreen,
      app-board {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class AppComponent {
  title = 'Kinda Barebone and Generic Dungeon Crawler™ (with Ahri)';
  gameStarted: boolean = false;

  startGame() {
    this.gameStarted = !this.gameStarted;
  }
}