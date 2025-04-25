import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { BoardComponent } from './components/board/board.component';
import { StartscreenComponent } from './components/startscreen/startscreen.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { NgIf } from '@angular/common';
import { SoundService } from './app/services/sound.service';

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
        animate(
          '0.5s ease-in',
          style({ opacity: 0, scale: 0.8, transform: 'translateY(-100%)' })
        ),
      ]),
    ]),
  ],
  template: `
    <audio #backgroundMusic loop>
      <source src="/audio/02_Tristram.mp3" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

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

  @ViewChild('backgroundMusic') backgroundMusic!: ElementRef<HTMLAudioElement>;

  

  constructor(private soundService: SoundService) {}
  
  ngAfterViewInit() {
    this.soundService.isMusicPlaying.subscribe((isPlaying) => {
      const audioElement = this.backgroundMusic.nativeElement;
      if (isPlaying) {
        audioElement.volume = 0.1;
        audioElement.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      } if (!isPlaying) {
        this.backgroundMusic.nativeElement.pause();
      }
    });
  }

  startGame() {
    this.gameStarted = true;
    this.soundService.toggleMusic();
  }
}