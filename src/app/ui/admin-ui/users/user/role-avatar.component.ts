import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import {Role} from "@revector/auth-service";
import {MdButtonToggleChange} from "@angular/material";


@Component({
  selector: 'rv-role-avatar',
  template: `
<div>
<md-button-toggle  [checked]="active" (change)="doChange($event)">{{role.description}}</md-button-toggle>
</div>
`,
  styleUrls: ['user-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleAvatarComponent {

  @Input() role: Role
  @Input() active: boolean = false

  @Output() change: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  constructor() {

  }

  ngOnChanges(change: any) {
  }

  doChange(event:MdButtonToggleChange){
    this.active = event.source.checked
    this.change.emit(this.active)
  }


}
