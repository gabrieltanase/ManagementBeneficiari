import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/beneficiaries', pathMatch: 'full' }, // Redirect to beneficiaries
  {
    path: 'beneficiaries',
    loadChildren: () => import('./features/beneficiaries/beneficiaries.routes')
      .then((m) => m.beneficiariesRoutes) },
  // { path: 'beneficiaries', component: BeneficiariesComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: '**', redirectTo: '/beneficiaries' } // Redirect any unknown paths to beneficiaries
];
