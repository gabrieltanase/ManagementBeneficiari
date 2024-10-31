import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ibanValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const iban = control.value;

    if (!iban) {
      return null;
    }

    // Check for the RO prefix
    if (!iban.startsWith('RO')) {
      return { invalidCountryCode: 'IBAN must start with "RO" for Romania' };
    }

    // Check for length requirement: Romania IBAN should have exactly 24 characters
    if (iban.length !== 24) {
      return { invalidLength: 'IBAN must be 24 characters long' };
    }

    /**
     * DISABLED FOR NOW to allow flexible iban's
     */
    // Validate the IBAN checksum
    // if (!isValidIbanChecksum(iban)) {
    //   return { invalidChecksum: 'IBAN is invalid' };
    // }

    return null; // Valid IBAN
  };
}

// Function to calculate and validate the IBAN checksum
function isValidIbanChecksum(iban: string): boolean {
  // Move the first four characters to the end of the IBAN
  const transformedIban = iban.slice(4) + iban.slice(0, 4);

  // Replace letters with numbers (A=10, B=11, ..., Z=35)
  const numericIban = transformedIban.replace(/[A-Z]/g, (char: string) => (char.charCodeAt(0) - 55).toString());

  // Perform modulo-97 operation to validate the checksum
  let remainder = '';
  for (const digit of numericIban) {
    remainder = (remainder + digit).slice(-9); // Keep remainder manageable
    remainder = (parseInt(remainder) % 97).toString();
  }

  return remainder === '1';
}
