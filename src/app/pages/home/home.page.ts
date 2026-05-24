import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TourFilterComponent } from '../../components/tour-filter/tour-filter.component';
import { Router } from '@angular/router';

import { TourFilter } from 'src/app/models/tour-filter.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonIcon,
    TourFilterComponent,
  ],
})
export class HomePage {
  private router = inject(Router);

  goToTours(filters: TourFilter): void {
    this.router.navigate(['/tours'], {
      queryParams: filters,
    });
  }
}
