import { Component, Input, OnInit } from '@angular/core';
import { Tour } from '../../models/tour.model';
import { DecimalPipe } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tour-card',
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.scss'],
  imports: [DecimalPipe, CommonModule],
})
export class TourCardComponent {
  @Input()
  tour!: Tour;
}
