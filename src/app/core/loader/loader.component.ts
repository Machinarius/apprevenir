import { Component } from "@angular/core";

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html"
})
export class LoaderComponent {
  constructor() {
    this.showLoadingIndicator = this.showLoadingIndicator.bind(this);
  }

  loadingReferences = 0;
  public async showLoadingIndicator<TReturn>(promiseFactory: () => Promise<TReturn>): Promise<TReturn> {
    this.loadingReferences++;
    const result = await promiseFactory();
    this.loadingReferences--;
    return result;
  }

  get loadingData() {
    return this.loadingReferences > 0;
  }
}