import {
  Component,
  ChangeDetectionStrategy
} from "@angular/core";


@Component({
  selector: 'app-component',
  template: `<main-container></main-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor() { }
}
