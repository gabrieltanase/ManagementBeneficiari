import { Routes } from '@angular/router';
import { UnsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { BeneficiariesComponent } from '@features/beneficiaries/beneficiaries/beneficiaries.component';

export const routes: Routes = [
  { path: '', redirectTo: '/beneficiaries', pathMatch: 'full' }, // Redirect to beneficiaries
  {
    path: 'beneficiaries',
    loadChildren: () => import('./features/beneficiaries/beneficiaries.routes')
      .then((m) => m.beneficiariesRoutes) },
  // { path: 'beneficiaries', component: BeneficiariesComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: '**', redirectTo: '/beneficiaries' } // Redirect any unknown paths to beneficiaries
];
