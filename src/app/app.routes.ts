import type { Route } from '@angular/router';

export const routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/event-time-table/event-time-table').then(m => m.EventTimeTable)
  }
];

