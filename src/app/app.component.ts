import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HeaderDesktopComponent } from './components/header-desktop/header-desktop.component';
import { HeaderMobileComponent } from './components/header-mobile/header-mobile.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonApp,
    IonRouterOutlet,
    HeaderDesktopComponent,
    HeaderMobileComponent,
  ],
})
export class AppComponent {
  constructor() {}
}
