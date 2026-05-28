import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TourFilterComponent } from '../../components/tour-filter/tour-filter.component';
import { Router } from '@angular/router';

import { TourFilter } from 'src/app/models/tour-filter.model';
import AOS from 'aos';
import { OfferComponent } from '../../components/offer/offer.component';
import { TourCardComponent } from '../../components/tour-card/tour-card.component';
import { Tour } from '../../models/tour.model';
import { TourService } from '../../services/tour';

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
    IonGrid,
    IonRow,
    IonCol,
    IonCardHeader,
    IonCard,
    IonCardTitle,
    IonCardContent,
    IonButton,
    OfferComponent,
    TourCardComponent,
  ],
})
export class HomePage implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(IonContent) private content?: IonContent;
  private router = inject(Router);
  private ngZone = inject(NgZone);
  private zoomObserver?: IntersectionObserver;
  @ViewChild('tourSwiper')
  tourSwiper!: ElementRef;

  goToTours(filters: TourFilter): void {
    this.router.navigate(['/tours'], {
      queryParams: filters,
    });
  }
  ngAfterViewInit(): void {
    AOS.init({
      duration: 1200,
      once: true,
      offset: 120,
      delay: 0,
      easing: 'ease-in-out',
    });

    setTimeout(() => {
      AOS.refreshHard();
    }, 200);

    this.setupZoomCardObserver();

    const swiperEl = this.tourSwiper.nativeElement;

    Object.assign(swiperEl, {
      injectStyles: [
        `
      .swiper-pagination{
         bottom:-20px !important;
         z-index:1000;
        position:absolute !important;
        z-index:999;
      }

      .swiper-pagination-bullet{
        width:12px;
        height:12px;
        background:#cfd8cf;
        opacity:1;
        margin:0 6px;
      }

      .swiper-pagination-bullet-active{
        background:#45b649;
      }
    `,
      ],
    });

    swiperEl.initialize();
  }

  private tourService = inject(TourService);

  tours: Tour[] = [];
  filters: TourFilter = {};

  ngOnInit(): void {
    this.tourService.getTours(this.filters).subscribe({
      next: (data) => {
        this.tours = data.data;
      },

      error: (err: any) => {
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.zoomObserver?.disconnect();
    this.zoomObserver = undefined;
  }

  private setupZoomCardObserver(): void {
    if (typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      // Fallback: show immediately.
      document.querySelectorAll<HTMLElement>('[data-trig]').forEach((el) => {
        el.classList.add('trig');
      });
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.zoomObserver?.disconnect();
      this.zoomObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target as HTMLElement;
            el.classList.add('trig');
            this.zoomObserver?.unobserve(el);
          }
        },
        { threshold: 0.15 },
      );

      document.querySelectorAll<HTMLElement>('[data-trig]').forEach((el) => {
        this.zoomObserver?.observe(el);
      });
    });
  }

  activeIndex = 0;

  destinations = [
    {
      name: 'Đà Lạt',
      image: 'assets/images/tours/dalat.jpg',
    },
    {
      name: 'Hà Nội',
      image: 'assets/images/tours/hanoi.jpg',
    },
    {
      name: 'Hà Giang',
      image: 'assets/images/tours/hagiang.jpg',
    },
    {
      name: 'Ninh Thuận',
      image: 'assets/images/tours/ninhthuan.jpg',
    },
  ];

  selectedImage: string | null = null;
  currentIndex = 0;

  galleryImages = [
    'assets/images/home/left.jpg',
    'assets/images/home/right_1.jpg',
    'assets/images/home/right_2.jpg',
    'assets/images/home/right_3.jpg',
    'assets/images/home/right_4.jpg',
    'assets/images/home/right_5.jpg',
  ];
  openGallery(index: number) {
    this.currentIndex = index;
    this.selectedImage = this.galleryImages[index];

    document.body.style.overflow = 'hidden';
  }

  closeGallery() {
    this.selectedImage = null;
    document.body.style.overflow = '';
  }

  nextImage(event: Event) {
    event.stopPropagation();

    this.currentIndex = (this.currentIndex + 1) % this.galleryImages.length;

    this.selectedImage = this.galleryImages[this.currentIndex];
  }

  prevImage(event: Event) {
    event.stopPropagation();

    this.currentIndex =
      (this.currentIndex - 1 + this.galleryImages.length) %
      this.galleryImages.length;

    this.selectedImage = this.galleryImages[this.currentIndex];
  }

  /*câu hỏi thường gặp*/
  activeFaq: number | null = 0;

  faqs = [
    {
      question:
        'Chúng tôi có thể tùy chỉnh tour du lịch theo nhu cầu riêng không?',
      answer:
        'Có! Chúng tôi luôn sẵn sàng điều chỉnh lịch trình và điểm đến theo nhu cầu của bạn.',
    },

    {
      question: 'Các tour có bao gồm những dịch vụ gì?',
      answer:
        'Bao gồm lưu trú, xe đưa đón, hướng dẫn viên và các dịch vụ liên quan.',
    },

    {
      question: 'Có cần mua bảo hiểm du lịch không?',
      answer: 'Chúng tôi khuyến khích để tăng mức độ an toàn khi du lịch.',
    },

    {
      question: 'Làm thế nào để đặt tour?',
      answer: 'Bạn có thể đặt tour trực tiếp trên website hoặc liên hệ tư vấn.',
    },
  ];

  toggleFaq(index: number) {
    this.activeFaq = this.activeFaq === index ? null : index;
  }
}
