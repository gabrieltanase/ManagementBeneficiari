import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Beneficiary } from '@core/models/beneficiary.model';
import { BeneficiaryService } from '@core/services/beneficiary.service';
import { BeneficiariesListComponent } from '@features/beneficiaries/beneficiaries-list/beneficiaries-list.component';
import { ToastService } from '@core/services/toast.service';
import { NavigationService } from '@core/services/navigate.service';
import { Button, ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { BeneficiariesFormComponent } from '@features/beneficiaries/beneficiaries-form/beneficiaries-form.component';

@Component({
  selector: 'app-beneficiaries',
  standalone: true,
  imports: [
    RouterOutlet,
    Button,
    ButtonDirective,
    TableModule,
    BeneficiariesListComponent,
    DialogModule,
    BeneficiariesFormComponent
  ],
  templateUrl: './beneficiaries.component.html',
  styleUrl: './beneficiaries.component.scss'
})
export class BeneficiariesComponent implements OnInit {
  beneficiaries: Beneficiary[] = [];

  constructor(
    private beneficiaryService: BeneficiaryService,
    private toastService: ToastService,
    private confirmationService: ConfirmationService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.beneficiaries = this.getBeneficiaries();
  }

  getBeneficiaries() : Beneficiary[] {
    return this.beneficiaryService.getBeneficiaries();
  }

  addBeneficiary() {
    this.navigationService.navigateTo(['beneficiaries', 'add'])
      .then(r => console.log(r))
      .catch(e => console.log(e));
  }

  editBeneficiary(id: string) {
    this.navigationService.navigateTo( ['beneficiaries', 'edit', id])
      .then(r => console.log(r))
      .catch(e => console.log(e));
  }

  deleteBeneficiary(id: string) {
    this.confirmationService.confirm({
      message: 'Sunteți sigur că doriți să ștergeți acest beneficiar?',
      header: 'Stergeți beneficiar',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'bg-red-600 border-red-700 text-white hover:bg-red-800 active:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500',
      rejectButtonStyleClass: 'bg-green-500 border-green-600 text-white hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400',
      accept: () => {
        this.beneficiaryService.deleteBeneficiary(id)
        this.toastService.showWarn(`Beneficiarul cu ID-ul ${id} a fost sters cu succes.`);
        this.beneficiaries = this.getBeneficiaries(); // Refresh list
      },
      reject: () => {
        this.toastService.showInfo('Stergere anulata');
      }
    });
  }

  // TODO: we can also implement this into a modal and modify the routing and this component to watch for unsaved
  //  data
  // hasUnsavedChanges(): boolean {
  //   // Replace with logic to check for unsaved changes in the form or modal
  //   return this.isFormDirty || this.isModalOpen;
  // }
}
