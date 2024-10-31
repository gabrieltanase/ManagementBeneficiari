import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './input-text-field.component.html',
  styleUrl: './input-text-field.component.scss'
})
export class InputTextFieldComponent implements OnInit, OnDestroy {
  // @Input() label: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() inputClass: string = 'w-full';
  @Input() control!: FormControl; // Accept FormControl for single input
  @Input() formArrayControl?: FormArray; // Accept FormArray for multiple inputs
  @Input() index?: number; // Index of the control in the FormArray
  @Input() type: string | undefined = 'text';
  @Input() maxLength: number = 100;
  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | null = null;
  private statusSubscription!: Subscription;

  // Getter for the current control, either standalone or within FormArray
  get targetControl(): FormControl {
    return this.control || (this.formArrayControl && this.index !== undefined
      ? this.formArrayControl.at(this.index) as FormControl
      : new FormControl(''));
  }

  ngOnInit() {
    this.statusSubscription = this.control.statusChanges.subscribe(() => {
      this.updateErrorMessage()
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.targetControl.setValue(inputValue);
    this.valueChange.emit(inputValue);
    // Only show error message if the user has started typing (dirty state)
    if (this.targetControl.dirty) {
      this.updateErrorMessage();
    }
  }

  updateErrorMessage() {
    this.errorMessage = this.getErrorMessage();
  }

  getErrorMessage(): string | null {
    const errors = this.targetControl.errors;
    if (errors) {
      const { required, minlength, maxlength, email, pattern } = errors;

      if (required) {
        return `Câmpul este obligatoriu.`; // The field is required.
      }
      if (minlength) {
        return `Lungimea minimă este ${minlength.requiredLength} caractere.`; // Minimum length is ${minlength.requiredLength} characters.
      }
      if (maxlength) {
        return `Lungimea maximă este ${maxlength.requiredLength} caractere.`; // Maximum length is ${maxlength.requiredLength} characters.
      }
      if (email) {
        return `Vă rugăm să introduceți o adresă de email validă.`; // Please enter a valid email address.
      }
      if (pattern) {
        return `Vă rugăm să introduceți un format valid.`; // Please enter a valid format.
      }

      return Object.values(errors)[0] || 'Invalid input.'; // Fallback message
    }
    return null;
  }
}
