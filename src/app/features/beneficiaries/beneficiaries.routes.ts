import { Routes } from '@angular/router';
import { BeneficiariesFormComponent } from '@features/beneficiaries/beneficiaries-form/beneficiaries-form.component';
import { UnsavedChangesGuard } from '@core/guards/unsaved-changes.guard';
import { BeneficiariesComponent } from '@features/beneficiaries/beneficiaries/beneficiaries.component';

export const beneficiariesRoutes: Routes = [
  { path: '', component: BeneficiariesComponent },
  { path: 'add', component: BeneficiariesFormComponent, canDeactivate: [UnsavedChangesGuard] },
  { path: 'edit/:id', component: BeneficiariesFormComponent, canDeactivate: [UnsavedChangesGuard] },
]
