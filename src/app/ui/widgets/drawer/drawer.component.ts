import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output
} from "@angular/core";
import any = jasmine.any;

@Component({
  selector: 'rv-drawer',
  template: `
<ng-content *ngIf="expanded"></ng-content>
<div class="rv-drawer-toggle" flex layout="row" layout-align="center" (click)="doToggleDrawer(); $event.preventDefault()">
      <div class="rv-toggle-left" flex></div>
      <div class="toggle-shape-container">
        <div class="rv-toggle-shape">
          <svg viewBox='0 0 100 50' preserveAspectRatio='none'>
            <path d='M 0, 0 c20,8 20,38 35,48 h30 c15,-10 15,-40 35,-48'></path>
            <line x1='35' y1='15' x2='65' y2='15'></line>
            <line x1='35' y1='25' x2='65' y2='25'></line>
            <line x1='35' y1='35' x2='65' y2='35'></line>
          </svg>
        </div>
      </div>
      <div class="rv-toggle-right" flex></div>
    </div>`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent {

  @Input() expanded: boolean = false
  @Output() expandedChanged:EventEmitter<boolean> = new EventEmitter<boolean>()

  constructor() {

  }

  ngOnChanges(change: any) {

  }

  doToggleDrawer(){
    this.expanded = !this.expanded
    this.expandedChanged.emit(this.expanded)
  }


}
