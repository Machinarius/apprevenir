import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { AbstractControl, FormControl, FormGroup } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";

export interface ChipInputTerm {
	id: number | null,
	label: string
}

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

	@ViewChild('termInput') termInput: ElementRef<HTMLInputElement>;

	separatorKeysCodes: number[] = [ENTER, COMMA];
	inputControl = new FormControl();

	userTerms: ChipInputTerm[] = [];

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
      this.userTerms.push({
				id: null,
				label: value.trim()
			});
			
			this.storeTermsIntoForm();
    }

    if (input) {
      input.value = '';
    }
  }

  removeTerm(term: ChipInputTerm): void {
    const index = this.userTerms.indexOf(term);

    if (index >= 0) {
      this.userTerms.splice(index, 1);
			this.storeTermsIntoForm();
    }
  }

	private loadTermsFromForm() {
		this.userTerms = this.formControl.value || [];
	}

	private storeTermsIntoForm() {
		this.formControl.setValue(this.userTerms);
	}
}