import { Injectable } from '@angular/core';
import { Beneficiary } from '@core/models/beneficiary.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {

  private storageKey = 'beneficiaries';

  getBeneficiaries(): Beneficiary[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveBeneficiary(beneficiary: Beneficiary): void {
    const beneficiaries = this.getBeneficiaries();

    // Assign a unique ID if not already present
    if (!beneficiary.id) {
      beneficiary.id = uuidv4();
    }

    beneficiaries.push(beneficiary);
    localStorage.setItem(this.storageKey, JSON.stringify(beneficiaries));
  }

  deleteBeneficiary(id: string): void {
    const beneficiaries = this.getBeneficiaries().filter(b => b.id !== id);
    localStorage.setItem(this.storageKey, JSON.stringify(beneficiaries));
  }

  updateBeneficiary(updatedBeneficiary: Beneficiary): void {
    const beneficiaries = this.getBeneficiaries().map(b =>
      b.id === updatedBeneficiary.id ? updatedBeneficiary : b
    );
    localStorage.setItem(this.storageKey, JSON.stringify(beneficiaries));
  }
}
