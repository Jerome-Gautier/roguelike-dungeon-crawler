import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SoundData {
  file: string;
  volume?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private musicEnabled = false;
  private soundEnabled = false;
  
  // Volume control properties
  private defaultSoundVolume = 0.3;
  private defaultMusicVolume = 0.1;
  private duckedMusicVolume = 0.03; // Lower volume when voice is playing
  private isVoicePlaying = false;
  
  // Observables that the component will subscribe to
  private musicPlaying = new BehaviorSubject<boolean>(false);
  private soundEffectSubject = new BehaviorSubject<SoundData | null>(null);
  private voiceLineSubject = new BehaviorSubject<SoundData | null>(null);
  private soundEnabledSubject = new BehaviorSubject<boolean>(false);
  private musicVolumeSubject = new BehaviorSubject<number>(this.defaultMusicVolume);

  isMusicPlaying = this.musicPlaying.asObservable();
  currentBackgroundMusic = this.musicPlaying.asObservable();
  currentSoundEffect = this.soundEffectSubject.asObservable();
  currentVoiceLine = this.voiceLineSubject.asObservable();
  isSoundEnabled = this.soundEnabledSubject.asObservable();
  musicVolume = this.musicVolumeSubject.asObservable();

  diceRoll() {
    return Math.floor(Math.random() * 10) + 1;
  }

  // Toggle methods
  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    this.musicPlaying.next(this.musicEnabled);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    this.soundEnabledSubject.next(this.soundEnabled);
  }

  // Play a sound effect
  playSoundEffect(soundFile: string, volume: number = 0.3) {
    if (!this.soundEnabled) return;
    
    this.soundEffectSubject.next({ file: soundFile, volume });
  }

  // Play a voice line
  playVoiceLine(voiceFile: string, volume: number = 0.3) {
    if (!this.soundEnabled) return;
    
    this.voiceLineSubject.next({ file: voiceFile, volume: volume || this.defaultSoundVolume });
  }

  playClickStart() {
    this.playSoundEffect("player/Ahri_Select_SFX.ogg");
  }

  playStartLine() {
    this.playVoiceLine("player/Ahri_Original_MoveFirst_1.ogg");
  }

  playQspellvoiceLine() {
    if (this.diceRoll() > 5) {
      this.playVoiceLine("player/spells/Ahri_Original_Q_3.ogg");
    } else {
      this.playVoiceLine("player/spells/Ahri_Original_Q_4.ogg");
    }    
  }

  playEspellvoiceLine() {
    if (this.diceRoll() > 5) {
      this.playVoiceLine("player/spells/Ahri_Original_EHit_0.ogg");
    } else {
      this.playVoiceLine("player/spells/Ahri_Original_EHit_1.ogg");
    }    
  }

  playRspellvoiceLine() {
    if (this.diceRoll() > 6) {
      this.playVoiceLine("player/spells/Ahri_Original_R2_0.ogg");
    } else if (this.diceRoll() < 3) {
      this.playVoiceLine("player/spells/Ahri_Original_R2_1.ogg");
    } else {
      this.playVoiceLine("player/spells/Ahri_Original_R2_2.ogg");
    }
  }

  playPassiveCollected() {
    this.playVoiceLine("player/Ahri_Original_Passive_4.ogg");
  }

  playAllShardsCollected() {
    this.playVoiceLine("player/Ahri_Original_Move_11.ogg");
  }

  playDeathLine() {
    this.playVoiceLine("player/Ahri_Original_Death_2.ogg");
  }

  playRespawnLine() {
    this.playVoiceLine("player/Ahri_Original_Respawn_3.ogg");
  }
}

  

