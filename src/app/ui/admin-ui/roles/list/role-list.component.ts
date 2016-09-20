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

  @Input() rolesObj: {[key: string]: RoleState} = {}
  @Input() permissionsObj: {[key: string]: PermissionState} = {}

  @Output() addRole: EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() roleChange: EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)

  roles: Role[] = []
  permissions: Permission[] = []

  private _tempIdx = 0

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change: any) {
    if (change.rolesObj) {
      let rolesObj = change.rolesObj.currentValue
      this.roles = Object.keys(rolesObj).map((key: string) => {
        return rolesObj[key]
      })
    }
    if (change.permissionsObj && this.permissionsObj) {
      let permissionsObj = change.permissionsObj.currentValue
      let tempPermissions: Permission[] = Object.keys(permissionsObj).map((key: string) => {
        return permissionsObj[key]
      })
      tempPermissions.sort((a, b) => {
        return a.orderIndex - b.orderIndex
      })
      this.permissions = tempPermissions
    }
  }

  onRemoveRole(role: Role) {
    this.removeRole.emit(role)
  }

  onChange(role: Role) {
    this.roleChange.emit(role)
  }

  doAddRole() {
    let role: Role = {
      $key: this._nextName("Role"),
      description: "",
      orderIndex: this.roles[this.roles.length - 1].orderIndex + 1
    }
    this.addRole.emit(role)
  }

  _nextName(name: string) {
    while (this._nameExists(name + ' ' + (++this._tempIdx))) {
    }
    return name + ' ' + this._tempIdx
  }

  _nameExists(name: string) {
    return this.roles.some((role: Role) => {
      return role.$key == name
    })
  }


}
