import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  private _isMusicPlaying = new BehaviorSubject<boolean>(false);
  isMusicPlaying = this ._isMusicPlaying.asObservable();
  private _isSoundEnabled = new BehaviorSubject<boolean>(false);
  isSoundEnabled = this._isSoundEnabled.asObservable();

  toggleMusic(): void {
    this._isMusicPlaying.next(!this._isMusicPlaying.getValue());

  }

  toggleSound(): void {
    this._isSoundEnabled.next(!this._isSoundEnabled.getValue());
  }
}
