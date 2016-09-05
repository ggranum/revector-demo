import {Component, ChangeDetectionStrategy} from '@angular/core'

@Component({
  selector: 'app-root-container',
  template: `
<app-root></app-root>
`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppContainer {
  constructor() {

  }
}
