import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator for Arabic characters
export function arabicCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^[\u0600-\u06FF\s]+$/.test(control.value);
    return isValid ? null : { 'arabicOnly': true };
  };
}

// Validator for English characters
export function englishCharactersValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^[A-Za-z\s]+$/.test(control.value);
    return isValid ? null : { 'englishOnly': true };
  };
}
