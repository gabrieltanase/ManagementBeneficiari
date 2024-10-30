import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function phoneNumberValidator(minLength: number = 10, maxLength: number = 15): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phone = control.value;

    if (!phone) {
      return null; // Allow empty values to pass the validator, can adjust based on required fields
    }

    // Define the regex: allows an optional leading '+' for international numbers, followed by digits only
    const phoneRegex = new RegExp(`^\\+?\\d{${minLength},${maxLength}}$`);

    // Check if phone number matches the pattern
    const valid = phoneRegex.test(phone);

    return valid ? null : { invalidPhoneNumber: 'Invalid phone number.' };
  };
}
