import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { items } from '../../../../public/data/items';
import { skills } from '../../../../public/data/skills';

@Component({
  selector: 'app-startscreen',
  imports: [NgFor],
  template: `
    <div class="outer-container">
      <div class="startscreen-content">
        <div class="header-container">
          <h1>Welcome to {{ title }}</h1>
          <p>Ahri has been ambushed by Noxus soldiers and hit by an unknown magic, but a clever Fox is never caught!</p>
          <p>Help her get her memories back and find a way to escape</p>
        </div>

        <div class="separation"></div>

        <div class="section-container">
          <p>Collect the 20 memory shards to increase Ahri's strength</p>
          <img src="{{ items['memory_shard'].image}}" alt="{{ items['memory_shard'].name }}" width="50" height="50" />
        </div>

        <div class="separation"></div>

        <div class="section-container">
          <p>Find items to help Ahri survive the upcoming battles</p>
          <ul class="section-list">
            <li>
              <img src="{{ items['health_potion'].image}}" alt="{{ items['health_potion'].name }}" width="50" height="50" />
            </li>
            <li>
              <img src="{{ items['mana_potion'].image}}" alt="{{ items['mana_potion'].name }}" width="50" height="50" />
            </li>
          </ul>
        </div>

        <div class="separation"></div>
        
        <div class="section-container">
          <p>Recover Ahri's memories of her lost spells and use them wisely to defeat the Noxian soldiers</p>
          <ul class="section-list">
            <li *ngFor='let skill of skillsList'>
              <img [src]='skill.image' alt='{{ skill.name }}' width='50' height='50' />
            </li>
          </ul>
        </div>
        <button (click)='this.startGame.emit()' class="start-btn">Start the game</button>
      </div>
    </div>
  `,
  styles: [
    `
      .outer-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100%;
        background-image: url('/images/background/bg-spirit-forest.jpg');
        background-size: cover;
        background-position: center;
      }

      .separation {
        width: 80%;
        height: 2px;
        background-color: pink;
        margin: 24px 0;
        border-radius: 10px;
      }

      .startscreen-content {
        background-color: rgba(71, 71, 71, 0.7);
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: left;
      }

      .header-container h1 {
        color: pink;
        font-size: 40px;
        margin: 20px 0;
      }

      .header-container p {
        max-width: 800px;
        font-size: 25px;
        color: #fff;
      }

      .section-container p {
        font-size: 25px;
        color: #fff;
        margin-bottom: 12px;
      }

      .section-list {
        display: inline-flex;
        flex-flow: row nowrap;
        padding: 10px 0;
        gap: 10px;
        border-radius: 10px;
      }

      .section-list li {
        list-style: none;
        padding: 0;
        margin: 0;
        height: 50px;
        display: flex;
        align-items: center;
      }

      .start-btn {
        background-color: pink;
        color: black;
        margin-top: 24px;
        margin-bottom: 20px;
        padding: 10px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 24px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
        letter-spacing: 0.8px;
        transition: all 0.3s ease-in-out;
      }

      .start-btn:hover {
        background-color:rgb(228, 91, 233);
        color: white;
      }
    `,
  ],
})
export class StartscreenComponent {
  @Input() title!: string;
  @Output() startGame = new EventEmitter<void>();

  items = items;
  itemsList = Object.keys(items).map((key) => items[key]);
  skills = skills
  skillsList = Object.keys(skills).map((key) => skills[key]);
}