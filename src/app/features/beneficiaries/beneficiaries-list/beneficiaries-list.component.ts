import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Beneficiary } from '@core/models/beneficiary.model';
import { ButtonDirective } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-beneficiaries-list',
  standalone: true,
  imports: [
    ButtonDirective,
    PrimeTemplate,
    TableModule
  ],
  templateUrl: './beneficiaries-list.component.html',
  styleUrl: './beneficiaries-list.component.scss'
})
export class BeneficiariesListComponent {

  @Input() beneficiaries: Beneficiary[] = [];
  @Output() onEdit = new EventEmitter();
  @Output() onDelete = new EventEmitter<string>();

  editBeneficiary(beneficiary: Beneficiary) {
    this.onEdit.emit(beneficiary.id)
  }

  removeBeneficiary(id: string) {
    this.onDelete.emit(id)
  }
}
