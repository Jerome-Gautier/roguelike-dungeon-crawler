import { Component } from "@angular/core";
import { BoardComponent } from "./components/board/board.component";
import { StartscreenComponent } from "./components/startscreen/startscreen.component";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-root',
  imports: [BoardComponent, StartscreenComponent, NgIf],
  template: `
  <app-startscreen *ngIf='!gameStarted' [title]='title' (startGame)="startGame()" />
  <app-board *ngIf='gameStarted' [title]='title' />
  `,
  styles: [``],
})
export class AppComponent {
  title = "Kinda Barebone and Generic Dungeon Crawler™";
  gameStarted: boolean = false;

  startGame() {
    this.gameStarted = !this.gameStarted;
  }
}