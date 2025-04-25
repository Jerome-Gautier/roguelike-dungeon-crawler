import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { PlayerService } from '../../../app/services/player.service';
import { AudioIconComponent } from '../../icons/audio-icon.components';
import { NoaudioIconComponent } from '../../icons/noaudio-icon.components';
import { MusicIconComponent } from '../../icons/music-icon.components';
import { NomusicIconComponent } from '../../icons/nomusic-icon.components';
import { SoundService } from '../../../app/services/sound.service';

@Component({
  selector: 'app-player-sidebar',
  imports: [
    NgFor,
    NgIf,
    AudioIconComponent,
    NoaudioIconComponent,
    MusicIconComponent,
    NomusicIconComponent,
  ],
  template: `
    <div class="outer-container" [class.visible]="sidebarVisible">
      <div class="sound-control-container">
        <button class="sound-btn" (click)="toggleMusic()">
          @switch(this.isMusicPlaying) {
            @case (false) { <app-nomusic-icon /> }
            @case (true) { <app-music-icon /> }
          }
        </button>
        <button class="sound-btn" (click)="toggleSound()">
          @switch(this.isSoundEnabled) {
            @case (false) { <app-noaudio-icon /> }
            @case (true) { <app-audio-icon /> }
          }
        </button>
      </div>

      <button class="hide-button" (click)="sidebarVisible = !sidebarVisible">
        {{ sidebarVisible ? '<' : '>' }}
      </button>
      <div class="sidebar-content">
        <div class="player-stats">
          <h2>{{ this.player.name }}' Status</h2>
          <p>Level: {{ this.player.level }}</p>
          <p>Experience: {{ this.player.xp }} / {{ this.player.xpToLevel }}</p>
          <p>Health: {{ this.player.health }} / {{ this.player.healthMax }}</p>
          <p>Mana: {{ this.player.mana }} / {{ this.player.manaMax }}</p>
          <p>
            Damage: {{ this.player.damageMin }} - {{ this.player.damageMax }}
          </p>
        </div>
        <div class="activable-container">
          <h4>Abilities</h4>
          <ul class="skills-list">
            <li *ngFor="let skill of skillsList">
              <div *ngIf="player.skills[skill].unlocked">
                <button (click)="this.selectSpell.emit(skill)">
                  <img
                    src="{{ player.skills[skill].image }}"
                    alt="{{ player.skills[skill].name }}"
                    width="50"
                    height="50"
                  />
                </button>
                <div class="tooltip">
                  <h3>{{ player.skills[skill].name }}</h3>
                  <p>{{ player.skills[skill].description }}</p>
                  <p>Type: {{ player.skills[skill].type }}</p>
                  <p>
                    <strong>Mana Cost:</strong>
                    {{ player.skills[skill].manaCost }}
                  </p>
                  <p>
                    <strong>Damage:</strong> {{ player.skills[skill].damage }}
                  </p>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div class="activable-container">
          <h4>Inventory</h4>
          <ul class="items-list">
            <li
              *ngFor="let item of itemsList"
              (click)="this.useItem.emit(item)"
            >
              @if (player.items[item].owned > 0 || player.items[item].name ===
              'Memory Shard') {
              <img
                src="{{ player.items[item].image }}"
                alt="{{ player.items[item].name }}"
                width="50"
                height="50"
              />
              <p class="item-count">{{ player.items[item].owned }}</p>
              <div class="tooltip">
                <h3>{{ player.items[item].name }}</h3>
                <p>{{ player.items[item].description }}</p>
              </div>
              }
            </li>
          </ul>
        </div>
      </div>
      <div class="logs-container">
        <h3>Events</h3>
        <ul class="logs-list">
          <li
            *ngFor="let log of logs"
            [class]="{
                fightwon: log.event === 'fightwon',
                fight: log.event === 'fight',
                itemobtained: log.event === 'itemobtained',
                skilllearnt: log.event === 'skilllearnt',
                spellcast: log.event === 'spellcast',
                nomana: log.event === 'nomana',
              }"
          >
            {{ log.message }}
          </li>
        </ul>
      </div>
    </div>
  `,
  styles: `
  .outer-container {
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    align-items: center;
    top: 0;
    left: 0;
    width: 400px;
    height: 100vh;
    background-color: #272932;
    background-image: url('/images/background/bg-ahri-shrine.jpg');
    background-position: center;
    z-index: 1000;
    transform: translateX(-375px);
    transition: transform 0.4s ease-in-out;
  }
  
  .outer-container.visible {
    transform: translateX(0);
  }

  .sound-control-container {
    position: absolute;
    display: flex;
    top: 10px;
    left: 10px;
    gap: 20px;
    padding: 10px;
  }

  .sound-control-container .sound-btn {
    font-size: 18px;
    padding: 10px;
    cursor: pointer;
    fill: #fff;
    background-color: black;
    border-radius: 50%;
  }
  
  .hide-button {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 20px;
    background-color: transparent;
    color: #fff;
    border: none;
    padding: 10px;
    cursor: pointer;
  }
  
  .sidebar-content {
    box-sizing: border-box;
    width: 98%;
    margin: 100px 10px 0 10px;
    padding: 10px;
    color: #FFFFFF; /* White */
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
    background-color: rgba(0, 0, 0, 0.8); /* Semi-transparent background */
    border-radius: 5px;    
  }

  .sidebar-content .player-stats {
    margin-bottom: 20px;
  }

  .sidebar-content .player-stats p {
    font-size: 18px;
    margin: 5px 0;
  }

  .activable-container h4 {
    font-size: 18px;
    font-weight: 400;
    letter-spacing: 1.2px;
  }

  .activable-container ul {
    display: flex;
    flex-flow: row wrap;
    height: 50px;
    margin: 8px 0;
  }
  
  .activable-container ul li {
    position: relative;
    margin: 5px;
    cursor: pointer;
  }

  .items-list li .item-count {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .skills-list li img  {
    -webkit-mask-image: linear-gradient(45deg,#000 25%,rgba(0,0,0,.2) 50%,#000 75%);
    mask-image: linear-gradient(45deg,#000 25%,rgba(0,0,0,.2) 50%,#000 75%);
    -webkit-mask-size: 800%;
    mask-size: 800%;
    -webkit-mask-position: 0;
    mask-position: 0;
  }

  .skills-list li img:hover {
    transition: mask-position 2s ease,-webkit-mask-position 2s ease;
    -webkit-mask-position: 120%;
    mask-position: 120%;
    opacity: 1;
  }
  
  .tooltip {
    display: none;
    position: absolute;
    top: 60px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    width: 200px;
    z-index: 10;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }

  .skills-list li:hover .tooltip,
  .items-list li:hover .tooltip {
    display: block;
  }
  
  .logs-container {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;  
    border-radius: 5px;
  }

  .logs-container h3 {
    color: #fff;
  }

  .logs-container .logs-list {
    overflow-y: scroll;
    border-radius: 5px;
    height: 200px;
    overflow-y: scroll;
    background-color: rgba(0, 0, 0, 0.9);
  }

  .logs-container li {
    font-size: 18px;
    margin: 12px 0;
    letter-spacing: 0.2px;
  }

  .logs-container li:first-child {
    font-weight: 800;
  }

  .logs-container li.fight {
    color: #b22222;
  }
  
  .logs-container li.fightwon {
    color: #32cd32;
  }
  
  .logs-container li.itemobtained {
    color: #5bc0de;
  }
  
  .logs-container li.skilllearnt {
    color: yellow;
  }
  
  .logs-container li.spellcast {
    color: #fff;
  }
  
  .logs-container li.nomana {
    color:rgb(100, 22, 22);
  }`,
})
export class PlayerSidebarComponent {
  @Input() logs: { event: string; message: string }[] = [];
  @Output() useItem = new EventEmitter();
  @Output() selectSpell = new EventEmitter();

  player = inject(PlayerService);
  isMusicPlaying: boolean = false;
  isSoundEnabled: boolean = false;

  sidebarVisible: boolean = true;

  itemsList: string[] = Object.keys(this.player.items);
  skillsList: string[] = Object.keys(this.player.skills);


  constructor(private soundService: SoundService) {
    this.soundService.isMusicPlaying.subscribe((isPlaying) => {
      this.isMusicPlaying = isPlaying;
    });
    this.soundService.isSoundEnabled.subscribe((isEnabled) => {
      this.isSoundEnabled = isEnabled;
    });
  }

  toggleMusic() {
    this.soundService.toggleMusic();
  }

  toggleSound() {
    this.soundService.toggleSound();
  }
}
