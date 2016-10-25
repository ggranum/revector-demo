import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {
  Permission,
  MappedPermission
} from "@revector/auth-service";


@Component({
  selector: 'rv-user-permission-editor',
  template: `
<button  md-raised-button
  *ngIf="permission"
 color="{{getColor()}}"
 
(click)="doChange($event)" 
[class.rv-explicitly-revoked]="isExplicitlyRevoked()"
[class.rv-explicitly-granted]="isExplicitlyGranted()"
>{{permission.description}}</button>
`,
  styleUrls: ['user-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPermissionEditorComponent {

  @Input() permission: Permission
  @Input() mappedPermission: MappedPermission

  @Output() change: EventEmitter<Event> = new EventEmitter<Event>(false);

  constructor() {

  }

  doChange(event: Event) {
    console.log('UserPermissionEditorComponent', 'doChange')
    this.change.emit(event)
  }

  getColor(): string {
    let color = this.isGranted() ? 'primary' : null
    if (this.isExplicitlyGranted()) {
      color = 'accent'
    } else if (this.isExplicitlyRevoked()) {
      color = 'warn'
    }
    return color
  }

  isGranted(): boolean {
    return this.mappedPermission != null
  }

  isExplicitlyGranted() {
    return this.mappedPermission && this.mappedPermission.explicitlyGranted === true
  }

  isExplicitlyRevoked() {
    return this.mappedPermission && this.mappedPermission.explicitlyRevoked === true
  }

}
