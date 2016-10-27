import {
  Component,
  ChangeDetectionStrategy
} from "@angular/core";


@Component({
  selector: 'app-component',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  constructor() { }
}
