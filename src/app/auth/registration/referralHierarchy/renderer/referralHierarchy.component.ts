import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { HierarchyNode } from "../HierarchyNode";

@Component({
  selector: 'referral-hierarchy',
  templateUrl: './referralHierarchy.component.html',
  styleUrls: ['./referralHierarchy.component.scss']
})
export class ReferralHierarchyComponent {
  @Input() formGroup: FormGroup;
  @Input() hierarchy: HierarchyNode;

  get label() {
    return this.hierarchy.label;
  }

  get choices() {
    return this.hierarchy.choices;
  }

  get formControlName() {
    return "referralHierarchy" + this.hierarchy.depth;
  }

  get nextHierarchyNode() {
    const selectedKey = this.formGroup.get(this.formControlName).value;
    const nextNode = this.hierarchy.descendants[selectedKey];
    return nextNode;
  }
}