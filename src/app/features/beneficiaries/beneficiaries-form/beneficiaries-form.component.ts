import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup, FormsModule,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { UnsavedChanges } from '@core/guards/unsaved-changes.guard';
import { InputTextFieldComponent } from '@shared/components/input-field/input-text-field.component';
import { cnpValidator, cuiValidator, ibanValidator, phoneNumberValidator } from '@shared/validators';
import { Button, ButtonDirective } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { BeneficiaryService } from '@core/services/beneficiary.service';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToastService } from '@core/services/toast.service';
import { NavigationService } from '@core/services/navigate.service';
import { ActivatedRoute } from '@angular/router';

interface BeneficiaryField {
  label: string;
  controlName: string;
  controlType?: string;
  required: boolean;
  maxLength?: number;
  type?: string; // Optional field type (text, date, etc.)
  customValidators?: ValidatorFn[];
}

interface BeneficiaryType {
  name: string;
  fields: BeneficiaryField[];
}

@Component({
  selector: 'app-beneficiaries-form',
  standalone: true,
  templateUrl: './beneficiaries-form.component.html',
  styleUrls: ['./beneficiaries-form.component.scss'],
  imports: [
    ReactiveFormsModule,
    InputTextFieldComponent,
    ButtonDirective,
    InputTextModule,
    Button,
    RadioButtonModule,
    FormsModule
  ],
})
export class BeneficiariesFormComponent implements OnInit, UnsavedChanges {
  beneficiaryForm!: FormGroup;

  beneficiaryTypes: BeneficiaryType[] = [
    {
      name: 'Persoana Juridica',
      fields: [
        { label: 'Denumire*', controlName: 'name', required: true, maxLength: 100 },
        { label: 'CUI*', controlName: 'cui', required: true, maxLength: 100, customValidators: [cuiValidator()] },
        { label: 'Data infiintarii', controlName: 'foundationDate', required: false, type: 'date' }
      ],
    },
    {
      name: 'Persoana Fizica',
      fields: [
        { label: 'Nume*', controlName: 'firstName', required: true, maxLength: 100 },
        { label: 'Prenume*', controlName: 'lastName', required: true, maxLength: 100 },
        {
          label: 'CNP*',
          controlName: 'cnp',
          required: true,
          maxLength: 100,
          customValidators: [cnpValidator()],
        },
        { label: 'Data nasterii', controlName: 'birthDate', required: false, type: 'date' }
      ],
    },
    // Add more beneficiary types here as needed
  ];

  commonFields: BeneficiaryField[] = [
    { label: 'Adresa', controlName: 'address', required: false, maxLength: 100 },
    { label: 'Telefon', controlName: 'phone', required: false, maxLength: 100, customValidators: [phoneNumberValidator()] },
    { label: 'Cont IBAN', controlName: 'ibanArray', controlType: 'array', required: false, maxLength: 100, customValidators: [ibanValidator()] },
  ]

  selectedBeneficiaryType!: BeneficiaryType;

  constructor(
    private fb: FormBuilder,
    private beneficiaryService: BeneficiaryService,
    private toastService: ToastService,
    private navigationService: NavigationService,
    private route: ActivatedRoute
  ) {}

  isEditMode: boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      // todo: maybe check somehow the uuid to be valid
      const beneficiaryId = params.get('id') || ''; // Get the beneficiary ID from the route

      if (beneficiaryId) {
        this.isEditMode = true;
        this.loadBeneficiaryData(beneficiaryId)
      } else {
        this.selectedBeneficiaryType = this.beneficiaryTypes[0]; // Default to the first beneficiary type
        this.initializeForm();
      }
    });
  }

  private loadBeneficiaryData(id: string) {
    const beneficiary = this.beneficiaryService.getBeneficiaryById(id); // Fetch beneficiary data using the service
    if (beneficiary) {
      this.selectedBeneficiaryType = this.beneficiaryTypes.find(type => {
        return type.fields.some(field => field.controlName in beneficiary);
      }) || this.beneficiaryTypes[0]; // Determine the type based on beneficiary data

      this.initializeForm();
      this.patchForm(beneficiary); // Patch the form with fetched data

      // Populate the ID field
      this.beneficiaryForm.patchValue({ id: beneficiary.id });
      // Populate IBAN array with existing IBANs
      this.populateIbanArray(beneficiary.ibanArray);
    }
  }

  patchForm(beneficiary: any) {
    this.beneficiaryForm.patchValue(beneficiary); // Patch the form with the beneficiary data
  }

  private initializeForm() {
    const controls: { [key: string]: any } = {};

    // Add the id field to the form controls
    controls['id'] = this.fb.control(null);

    // Get the fields for the selected beneficiary type
    this.selectedBeneficiaryType.fields.forEach(field => {
      controls[field.controlName] = this.createControl(field);
    });

    // Add common fields to the form controls
    this.commonFields.forEach(field => {
      controls[field.controlName] = this.createControl(field);
    });

    // Initialize the form with the combined controls
    this.beneficiaryForm = this.fb.group(controls);
  }

  private createControl(field: BeneficiaryField) {
    const validators = [];

    // Add required validator if the field is required
    // TODO: this can be a helper function for generic build in validators to be reused
    if (field.required) {
      validators.push(Validators.required);
    }
    // Add maxLength validator if maxLength is defined
    if (field.maxLength) {
      validators.push(Validators.maxLength(field.maxLength));
    }
    // .....
    // TODO: .... add the rest of build in validators

    // Add custom validators
    if (field.customValidators) {
      validators.push(...field.customValidators);
    }

    // Handle 'array' control type for FormArrays
    if (field.controlType === 'array') {
      // Create a FormArray initialized with one FormControl as an example
      return this.fb.array([new FormControl('', validators)]);
    }

    // Return the control with the appropriate validators
    return new FormControl('', validators.length ? validators : []);
  }

  onBeneficiaryTypeChange(type: BeneficiaryType) {
    this.selectedBeneficiaryType = type;
    this.beneficiaryForm = this.fb.group({});
    this.initializeForm();
  }

  getFormControl(controlName: string): FormControl {
    return this.beneficiaryForm.get(controlName) as FormControl;
  }

  getAbstractFc(name: string, index: number): FormControl {
    return  this.getFormControl(name).get(index.toString()) as FormControl;
  }

  // IBAN STUFF
  // todo: refactor
  get ibanArray(): FormArray {
    return this.beneficiaryForm.get('ibanArray') as FormArray;
  }

  private populateIbanArray(ibanArray: string[]) {
    // Clear existing IBAN controls to avoid duplicates
    this.ibanArray.clear();

    ibanArray.forEach(iban => {
      this.ibanArray.push(new FormControl(iban, [ibanValidator()])); // Push existing IBANs into the FormArray
    });
  }

  ibanControl(index: number): FormControl {
    return this.ibanArray.at(index) as FormControl;
  }

  addIban() {
    this.ibanArray.push(new FormControl('', [ibanValidator()]));
  }

  removeIban(index: number) {
    this.ibanArray.removeAt(index);
  }

  getIbanLabel(label: string, index: number): string {
    return `${label} ${index + 1}`
  }
  // END OF IBAN

  onSubmit() {
    if (this.beneficiaryForm.valid) {
      this.isEditMode ?
        this.beneficiaryService.updateBeneficiary(this.beneficiaryForm.value) :
        this.beneficiaryService.saveBeneficiary(this.beneficiaryForm.value)
      this.beneficiaryForm.markAsPristine();  // Mark form as pristine after save
      this.goBack()
        .then(() => this.toastService.showSuccess(
          `Beneficiarul a fost ${this.isEditMode ? 'actualizat' : 'salvat'} cu succes`
        ));
    } else {
      console.error('Form is invalid');
      this.toastService.showError('Formularul este INVALID')
    }
  }

  isFormPristine(): boolean {
    return this.beneficiaryForm.pristine; // Returns true if the form is unchanged
  }

  cancel() {
    this.goBack().then(e => console.log(e));
  }

  hasUnsavedChanges(): boolean {
    return this.beneficiaryForm.dirty;
  }

  goBack(): Promise<boolean> {
    return this.navigationService.navigateTo(['beneficiaries']);
  }
}
