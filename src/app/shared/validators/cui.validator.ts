import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cuiValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cui = control.value;

    if (!cui) {
      // return { required: 'CUI is required' };
      return null;
    }

    // Check if CUI is between 8 to 10 digits and starts with a digit from 1-9
    if (!/^[1-9]\d{7,9}$/.test(cui)) {
      return { invalidFormat: 'CUI must be 8 to 10 digits, starting with a non-zero digit' };
    }

    // Validate checksum if CUI has exactly 10 digits
    if (cui.length === 10 && !isValidCuiChecksum(cui)) {
      return { invalidChecksum: 'CUI is invalid' };
    }

    return null; // Valid CUI
  };
}

// Function to calculate and validate the checksum of a 10-digit CUI
function isValidCuiChecksum(cui: string): boolean {
  const digits = cui.split('').map(Number);
  const weights = [7, 5, 3, 2, 9, 1, 4, 6, 8];
  const sum = digits.slice(0, 9).reduce((acc, digit, index) => acc + digit * weights[index], 0);
  const checksum = sum % 11 === 10 ? 1 : sum % 11;

  return checksum === digits[9];
}
