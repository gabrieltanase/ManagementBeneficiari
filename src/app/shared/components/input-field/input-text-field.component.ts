import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
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
  @Input() label: string = '';
  @Input() id: string = '';
  @Input() placeholder: string = '';
  @Input() class: string = '';
  @Input() control!: FormControl;
  @Input() type: string | undefined = 'text';
  @Input() maxLength: number = 100;
  @Output() valueChange = new EventEmitter<string>();

  errorMessage: string | null = null;
  private statusSubscription!: Subscription;

  ngOnInit() {
    this.statusSubscription = this.control.statusChanges.subscribe(() => {
      this.errorMessage = this.getErrorMessage();
    });
  }

  ngOnDestroy() {
    if (this.statusSubscription) {
      this.statusSubscription.unsubscribe();
    }
  }

  onInput(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.control.setValue(inputValue); // Set value on FormControl
    // this.getErrorMessage()
    //
    this.valueChange.emit(inputValue);
  }

  getErrorMessage(): string | null {
    if (this.control && this.control.errors) {
      const { required, minlength, maxlength, email, pattern } = this.control.errors;

      // Handle built-in validators
      if (required) {
        return  `The field is required.`; // TODO: translate to RO
      }
      if (minlength) {
        const requiredLength = minlength.requiredLength;
        return `Minimum length is ${requiredLength} characters.`;
      }
      if (maxlength) {
        const requiredLength = maxlength.requiredLength;
        return `Maximum length is ${requiredLength} characters.`;
      }
      if (email) {
        return 'Please enter a valid email address.';
      }
      if (pattern) {
        return 'Please enter a valid format.';
      }

      // console.log('errors:', this.control.errors)
      // Handle custom validators
      return Object.values(this.control.errors)[0] ||  'Invalid input.'; // Fallback message
    }
    return null;
  }
}
