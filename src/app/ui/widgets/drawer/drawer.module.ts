import {NgModule} from '@angular/core'
import {CommonModule} from '@angular/common'

//noinspection TypeScriptPreferShortImport
import {DrawerComponent} from "./drawer.component";


@NgModule({
  declarations: [
    DrawerComponent
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    DrawerComponent
  ]
})
export class DrawerModule {

}
