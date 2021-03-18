import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { MatChip, MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { UserInputTerm } from "../models/UserInputTerm";

@Component({
	selector: "chip-input",
	templateUrl: "./chip-input.component.html"
})
export class ChipInputComponent implements OnInit {
	@Input() description: string;
	@Input() title: string;
	@Input() placeholder: string;
	@Input() form: FormGroup;
	@Input() formKey: string;
	@Input() valuesAreRequired: boolean;
	@Input() valuesMissingError: string;

	@ViewChild('termInput') termInput: ElementRef<HTMLInputElement>;
	@ViewChild(MatChipList) chipList: MatChipList;

	separatorKeysCodes: number[] = [ENTER, COMMA];
	inputControl = new FormControl();

	allTerms: UserInputTerm[] = [];
	get userTerms(): UserInputTerm[] {
		return this.allTerms.filter(term => !term.deletedByUser);
	}

	ngOnInit(): void {
		this.loadTermsFromForm();
	}

	get formControl(): AbstractControl {
		return this.form.get(this.formKey);
	}

  addTerm(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.allTerms.push({
				id: null,
				label: value.trim(),
				deletedByUser: false
			});
			
			this.validateAndStoreTermsIntoForm();
    }

    if (input) {
      input.value = '';
    }
  }

  removeTerm(term: UserInputTerm): void {
    const index = this.userTerms.indexOf(term);

    if (index >= 0) {
			this.userTerms[index].deletedByUser = true;
			this.validateAndStoreTermsIntoForm();
    }
  }

	private loadTermsFromForm() {
		this.allTerms = this.formControl.value || [];
	}

	public runValidations() {
		if (this.valuesAreRequired) {
			if (this.userTerms.length == 0) {
				this.chipList.errorState = true;
				this.chipList._markAsTouched(); // Why would this be a private API? :thinking:
				this.formControl.setErrors({ required: true });

				return;
			} 
		}

		this.clearErrorState();
	}

	public clearErrorState() {
		this.chipList.errorState = false;
		this.formControl.setErrors(null);
	}

	private validateAndStoreTermsIntoForm() {
		this.formControl.setValue(this.allTerms);
		this.runValidations();
	}
}
