import { Component, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ClientTypes } from "@typedefs/backend";
import { LoaderComponent } from "src/app/core/loader/loader.component";
import { ReferralSources } from "../constants/referralSources";
import { ProfileFormData } from "../forms/profileFormLoader";
import { buildRootHierarchy } from "./referralHierarchy/builders/hierarchyBuilder";
import { HierarchyNode } from "./referralHierarchy/HierarchyNode";

@Component({
  selector: "client-config",
  templateUrl: "./client-config.component.html",
})
export class ClientConfigComponent {
  @Input("personalInfoForm") personalInfoFormGroup: FormGroup;
  @Input("loader") loader: LoaderComponent;
  
  referralSources = ReferralSources;
  rootReferralHierarchy: HierarchyNode | null = null;

  get selectedReferralSource(): ClientTypes {
    return this.personalInfoFormGroup.get('referralSource').value;
  }

  get referralHierarchyMustBeShown() {
    if (!this.personalInfoFormGroup) {
      return false;
    }

    return !!this.selectedReferralSource && this.selectedReferralSource !== ClientTypes.NaturalPerson;
  }

  public async onReferralSourceChanged() {
    this.rootReferralHierarchy = null;
    [1, 2, 3, 4, 5].forEach(
      index => {
        const hierarchyKey = 'referralHierarchy' + index;
        this.personalInfoFormGroup.get(hierarchyKey).setValue('');
      }
    );

    if (!this.referralHierarchyMustBeShown) {
      return;
    }

    if (this.selectedReferralSource == ClientTypes.TerritorialEntity) {
      await this.loader.showLoadingIndicator(async () => {
        this.rootReferralHierarchy = await buildRootHierarchy(this.selectedReferralSource);
      });

      return;
    }

    
  }

  public async ingestFormData(formData: ProfileFormData): Promise<void> {
    if (
      formData.personalInfo.referralSource == ClientTypes.TerritorialEntity
    ) {
      this.rootReferralHierarchy = await buildRootHierarchy(
        formData.personalInfo.referralSource
      );
    }
  }
}