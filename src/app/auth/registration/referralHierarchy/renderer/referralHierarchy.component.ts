import { AfterViewInit, Component, Input, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatSelect } from "@angular/material/select";
import { HierarchyNode } from "../HierarchyNode";

@Component({
  selector: 'referral-hierarchy',
  templateUrl: './referralHierarchy.component.html',
  styleUrls: ['./referralHierarchy.component.scss']
})
export class ReferralHierarchyComponent implements AfterViewInit {
  @Input() formGroup: FormGroup;
  @Input() hierarchy: HierarchyNode;

  @ViewChild("keySelector") keySelector: MatSelect;

  ngAfterViewInit(): void {
    if (!this.keySelector.options.find(option => option.value === this.selectedKey)) {
      console.warn("The selected key is not available in the options");
    }
  }

  get label() {
    return this.hierarchy.label;
  }

  get choices() {
    return this.hierarchy.choices;
  }

  get formControlName() {
    return "referralHierarchy" + this.hierarchy.depth;
  }

  get selectedKey() {
    return this.formGroup.get(this.formControlName).value;
  }

  get nextHierarchyNode() {
    const nextNode = this.hierarchy.descendants[this.selectedKey];
    return nextNode;
  }
}