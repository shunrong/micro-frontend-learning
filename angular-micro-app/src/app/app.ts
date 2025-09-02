import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div id="root">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      #root {
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class App {
  title = 'angular-micro-app';
}
