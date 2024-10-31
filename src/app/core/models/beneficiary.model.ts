export interface Individual {
  id?: string,
  firstName: string;
  lastName: string;
  cnp: string; // CNP for individuals
  birthDate: string;
  address: string;
  phone: string;
  ibanArray: string[];
}

export interface Business {
  id?: string;
  name: string;
  cui: string; // CUI for businesses
  foundationDate: string;
  address: string;
  phone: string;
  ibanArray: string[];
}

export type Beneficiary = Individual | Business;
