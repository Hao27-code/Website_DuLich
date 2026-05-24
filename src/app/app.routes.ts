import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.page').then((m) => m.AboutPage),
  },

  {
    path: 'tours',
    loadComponent: () =>
      import('./pages/tours/tours.page').then((m) => m.ToursPage),
  },

  {
    path: 'tours/:id',
    loadComponent: () =>
      import('./pages/tour-details/tour-details.page').then(
        (m) => m.TourDetailsPage,
      ),
  },

  {
    path: 'blog',
    loadComponent: () =>
      import('./pages/blog/blog.page').then((m) => m.BlogPage),
  },

  {
    path: 'blog/:slug',
    loadComponent: () =>
      import('./pages/blog-details/blog-details.page').then(
        (m) => m.BlogDetailsPage,
      ),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },

  {
    path: '**',
    redirectTo: '',
  },
];
