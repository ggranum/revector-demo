import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceState, Permission, PermissionState} from '@revector/auth-service'


@Component({
  selector: 'rv-permission-list-component',
  templateUrl: 'permission-list.component.html',
  styleUrls: ['permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListComponent {

  @Input() permissionsObj: {[key: string]: PermissionState} = {}

  @Output() addPermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)
  @Output() permissionChange: EventEmitter<Permission> = new EventEmitter<Permission>(false)
  @Output() removePermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)

  permissions: Permission[] = []
  private _tempIdx: number = 0

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change) {
    if (change.permissionsObj) {
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

  onRemovePermission(permission: Permission) {
    this.removePermission.emit(permission)
  }

  onChange(permission: Permission) {
    this.permissionChange.emit(permission)
  }

  doAddPermission() {
    let permission: Permission = {
      $key: this._nextName("Permission"),
      description: "",
      orderIndex: this.permissions[this.permissions.length - 1].orderIndex + 1
    }
    this.addPermission.emit(permission)
  }

  _nextName(name: string) {
    while (this._nameExists(name + ' ' + (++this._tempIdx))) {
    }
    return name + ' ' + this._tempIdx
  }

  _nameExists(name: string) {
    return this.permissions.some((permission: Permission) => {
      return permission.$key == name
    })
  }

}
