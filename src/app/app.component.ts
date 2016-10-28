import {
  Component,
  ChangeDetectionStrategy
} from "@angular/core";


@Component({
  selector: 'app-component',
  template: `<main-container flex layout="column" layout-align="start" layout-fill=""></main-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor() { }
}
