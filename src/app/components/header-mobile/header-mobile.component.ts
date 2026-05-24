import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header-mobile',
  templateUrl: './header-mobile.component.html',
  styleUrls: ['./header-mobile.component.scss'],
  imports: [IonicModule, RouterLinkActive, RouterLink],
})
export class HeaderMobileComponent {
  /* trạng thái menu */
  isMenuOpen = false;

  /* mở / đóng menu */
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /* đóng menu */
  closeMenu() {
    this.isMenuOpen = false;
  }
}
