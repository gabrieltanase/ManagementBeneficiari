import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function cnpValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cnp = control.value;

    if (!cnp) {
      return null;
    }

    // Check if CNP contains only numeric characters
    const onlyNumbersRegex = /^\d+$/;
    if (!onlyNumbersRegex.test(cnp)) {
      return { invalidCharacters: 'CNP must contain only numbers' };
    }

    // Check if CNP is exactly 13 digits long
    if (cnp.length !== 13) {
      return { invalidLength: 'CNP must be exactly 13 digits long' };
    }

    // Validate CNP checksum
    const checksum = calculateCnpChecksum(cnp);
    if (cnp[12] !== checksum.toString()) {
      return { invalidChecksum: 'CNP is invalid' };
    }

    return null; // Return null if all validations pass
  };
}

// Function to calculate the checksum of a CNP
function calculateCnpChecksum(cnp: string): number {
  const coefficients = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnp[i], 10) * coefficients[i];
  }

  return sum % 11 === 10 ? 1 : sum % 11; // CNP checksum digit
}
