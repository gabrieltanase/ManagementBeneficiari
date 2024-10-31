import { Injectable } from '@angular/core';
import { Beneficiary } from '@core/models/beneficiary.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class BeneficiaryService {
  private readonly storageKey = 'beneficiaries';

  private get beneficiaries(): Beneficiary[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  private assignUniqueId(beneficiary: Beneficiary): void {
    if (!beneficiary.id) {
      beneficiary.id = uuidv4();
    }
  }

  private updateLocalStorage(beneficiaries: Beneficiary[]): void {
    console.log('Update local storage : ', beneficiaries);
    localStorage.setItem(this.storageKey, JSON.stringify(beneficiaries));
  }

  getBeneficiaryById(id: string): Beneficiary | undefined {
    return this.beneficiaries.find(beneficiary => beneficiary.id === id);
  }

  getBeneficiaries() {
    return this.beneficiaries;
  }

  saveBeneficiary(beneficiary: Beneficiary): void {
    this.assignUniqueId(beneficiary);
    this.updateLocalStorage([...this.beneficiaries, beneficiary]);
  }

  updateBeneficiary(updatedBeneficiary: Beneficiary): void {
    if (!updatedBeneficiary.id) {
      return; // Exit if there's no ID
    }

    const updatedBeneficiaries = this.beneficiaries.map(b =>
      (b.id === updatedBeneficiary.id ? { ...b, ...updatedBeneficiary } : b)
    );

    this.updateLocalStorage(updatedBeneficiaries);
  }

  deleteBeneficiary(id: string): void {
    this.updateLocalStorage(this.beneficiaries.filter(b => b.id !== id));
  }
}
