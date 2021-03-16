import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";

export interface PillOption {
    key: string,
    label: string
}

@Component({
    selector: "chip-input",
    templateUrl: "./chip-autocomplete.component.html"
})
export class ChipAutoCompleteComponent implements OnInit {
	@Input() description: string;
	@Input() title: string;
	@Input() placeholder: string;
	@Input() options: PillOption[];
	@Input() form: FormGroup;
	@Input() formKey: string;

	@ViewChild('optionInput') optionInput: ElementRef<HTMLInputElement>;

	visible = true;
	selectable = true;
	removable = true;
	separatorKeysCodes: number[] = [ENTER, COMMA];
	filteredOptions: Observable<PillOption[]>;
	selectedOptions: PillOption[]=[];
	inputControl = new FormControl();

	ngOnInit(): void {
		this.filteredOptions = this.inputControl.valueChanges.pipe(
			startWith(null),
			map((option: string | null) => 
				option ? this._filterOption(option) : this.options.slice()
			)
		);
	}

  removeOption(option: PillOption): void {
		const index = this.selectedOptions.indexOf(option);
		if (index >= 0) {
			this.selectedOptions.splice(index, 1);
			this.storeSelectedOptions();
		}
  }

  selectedOption(event: MatAutocompleteSelectedEvent): void {
		const selectedOption: PillOption = event.option.value;
		this.selectedOptions.push(selectedOption);
		this.storeSelectedOptions();
		this.optionInput.nativeElement.value = "";
		this.inputControl.setValue(null);
  }

  private _filterOption(value: PillOption | string): PillOption[] {
		let filterValue = "";
		if (typeof value === "string") {
			filterValue = value.toLowerCase();
		} else if (value.label) {
			filterValue = value.label.toLowerCase();
		} else {
			throw new Error("Invalid filter input, did you configure things correctly?");
		}

    return this.options.filter(option => option.label.toLowerCase().indexOf(filterValue) !== -1);
  }

	private storeSelectedOptions() {
		const optionKeys = this.selectedOptions.map(option => option.key);
		const formControl = this.form.get(this.formKey);
		formControl.setValue(optionKeys);
	}
}