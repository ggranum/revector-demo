import {Component, ChangeDetectionStrategy} from '@angular/core'


/**
 * Global style imports for the entire App.
 */
import 'style!@angular2-material/core/style/core.css';
import 'style!@angular2-material/core/overlay/overlay.css';
import 'style!asciidoctorjs-web-repack/css/asciidoctor.css';



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
