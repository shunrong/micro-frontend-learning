import { Routes } from '@angular/router';
import { OrderManagementComponent } from './order-management.component';

export const routes: Routes = [
  { path: '', component: OrderManagementComponent },
  { path: '**', redirectTo: '' },
];
