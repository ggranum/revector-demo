import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {Role, RoleState, Permission, PermissionState, AuthServiceState} from '../../../../services/auth-service'



@Component({
  selector: 'rv-role-list-component',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {

  @Input() rolesObj:{[key:string]: RoleState} = {}
  @Input() permissionsObj:{[key:string]: PermissionState} = {}

  @Output() addRole: EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() roleChange:EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)

  roles:Role[] = []
  permissions:Permission[] = []

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change:any){
    if(change.rolesObj){
      let rolesObj = change.rolesObj.currentValue
      this.roles = Object.keys(rolesObj).map((key:string)=>{
        return rolesObj[key]
      })
    }
    if(change.permissionsObj && this.permissionsObj){
      let permissionsObj = change.permissionsObj.currentValue
      let tempPermissions:Permission[] = Object.keys(permissionsObj).map((key: string) => {
        return permissionsObj[key]
      })
      tempPermissions.sort((a, b) => {
        return a.orderIndex - b.orderIndex
      })
      this.permissions = tempPermissions
    }
  }

  onRemoveRole(role:Role){
    this.removeRole.emit(role)
  }

  onChange(role:Role){
      this.roleChange.emit(role)
  }

  doAddRole(){
    let role:Role = { name: "", description: ""}
    this.addRole.emit(role)
  }

}
