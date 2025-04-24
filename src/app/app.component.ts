import { Component } from "@angular/core";
import { BoardComponent } from "./components/board/board.component";
import { StartscreenComponent } from "./components/startscreen/startscreen.component";
import { animate, group, query, state, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-root',
  imports: [BoardComponent, StartscreenComponent],
  standalone: true,
  animations: [
    trigger('fadeOut', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, scale: 0.9 }),
        ], { optional: true }),
        query(':leave', [
          animate('1s', style({ opacity: 0, scale: 0.9 })),
        ], { optional: true }),
        query(':enter', [
          animate('1s', style({ opacity: 1, scale: 1 })),
        ], { optional: true }),      ]),
    ]),
  ],
  template: `
  <div class="container" [@fadeOut]="gameStarted ? 'fadeOut' : ''">
    @switch(gameStarted) {
      @case(false) { <app-startscreen (startGame)="startGame()" [title]="title" /> }
      @case(true) { <app-board [title]="title" /> }
    }
    </div>  
  `,
  styles: [`
    .container {
      background-color: #272932;
    }`],
})
export class AppComponent {
  title = "Kinda Barebone and Generic Dungeon Crawler™ (with Ahri)";
  gameStarted: boolean = false;

  startGame() {
    this.gameStarted = !this.gameStarted;
  }
}