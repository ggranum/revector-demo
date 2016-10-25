import {Component, ChangeDetectionStrategy} from '@angular/core'


/**
 * Global style imports for the entire App.
 * @todo ggranum: Migrate asciidoctor.css into SCSS and add (optional) namespacing0
 */
// import 'style!asciidoctorjs-web-repack/css/asciidoctor.css';


@Component({
  selector: 'app-root-container',
  template: `<router-outlet></router-outlet>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppContainer {
  constructor() {

  }
}
