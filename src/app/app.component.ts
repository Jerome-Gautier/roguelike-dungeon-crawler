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

    <audio #soundEffect>
      <source src="" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>

    <audio #voiceLine>
      <source src="" type="audio/mpeg" />
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
  @ViewChild('soundEffect') soundEffect!: ElementRef<HTMLAudioElement>;
  @ViewChild('voiceLine') voiceLine!: ElementRef<HTMLAudioElement>;

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

    this.soundService.currentSoundEffect.subscribe(soundData => {
      if (soundData && soundData.file) {
        const audioElement = this.soundEffect.nativeElement;
        audioElement.src = `/audio/${soundData.file}`;
        audioElement.volume = soundData.volume || 0.3;
        
        audioElement.play().catch((error) => {
          console.error('Error playing sound effect: ', error);
        });
      }
    });

    //Voie line subscription
    this.soundService.currentVoiceLine.subscribe(voiceData => {
      if (voiceData && voiceData.file) {
        const audioElement = this.voiceLine.nativeElement;
        audioElement.src = `/audio/${voiceData.file}`;
        audioElement.volume = voiceData.volume || 0.5;

        audioElement.play().catch((error) => {
          console.error('Error playing voice line: ', error);
        })
      }
    })
  }

  startGame() {
    this.gameStarted = true;
    this.soundService.toggleMusic();
    this.soundService.toggleSound();
    this.soundService.playClickStart();
  }
}