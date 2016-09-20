import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {Observable} from 'rxjs'
import {RolePermission, MappedPermission, Permission, Role} from '../../../../services/auth-service'
import {ObjMap, Update} from '../../../../shared'


@Component({
  selector: 'rv-role-component',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent {

  @Input() role: Role
  @Input() permissions: Permission[]
  @Input() rolePermissions: ObjMap<MappedPermission>

  @Output() change: Observable<Update<Role>>
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() addRolePermission: EventEmitter<RolePermission> = new EventEmitter<RolePermission>(false)
  @Output() removeRolePermission: EventEmitter<RolePermission> = new EventEmitter<RolePermission>(false)
  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed: boolean
  private _previous: Role


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((v) => v === true)
      .map(() => new Event('focus'))

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => {
        let change = {
          previous: Object.assign({}, this._previous),
          current: Object.assign({}, this.role)
        }
        this._previous = Object.assign({}, this.role)
        this._changed = false
        return change
      })

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(change: any) {
    if (change['role']) {
      this._previous = Object.assign({}, this.role)
      this._changed = false
    }
  }

  doRemoveRole() {
    this.removeRole.emit(this.role)
  }

  onChange(event: Event) {
    event.stopPropagation()
    this._changed = true
  }

  onBlur(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(false)
  }

  onFocus(event: Event) {
    event.stopPropagation()
    this._focusDebouncer.emit(true)

  }

  onSubmit() {
    console.log("RoleComponent", "onSubmit")
    this.submitted = true;
  }

  doTogglePermission(permission: Permission) {
    let rolePermission: RolePermission = {
      permission_name: permission.$key,
      role_name: this.role.$key
    }
    if (this.rolePermissions[permission.$key]) {
      this.removeRolePermission.emit(rolePermission)
    } else {
      this.addRolePermission.emit(rolePermission)
    }
  }

  hasPermission(perm: Permission) {
    let userPerm = this.rolePermissions[perm.$key]
    return userPerm && userPerm.explicitlyGranted === true
  }

  isExplicitlyRevoked(perm: Permission) {
    let userPerm = this.rolePermissions[perm.$key]
    return userPerm && userPerm.explicitlyRevoked === true
  }

}
