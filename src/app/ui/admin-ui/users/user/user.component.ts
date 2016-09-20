import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {Observable} from 'rxjs'
import {User, Role, UserRole, Permission, UserPermission, MappedPermission} from '@revector/auth-service'
import {ObjMap} from '@revector/shared'


@Component({
  selector: 'rv-user-component',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {

  @Input() user: User
  @Input() roles: Role[]
  @Input() userRoles: ObjMap<boolean> = {}
  @Input() permissions: Permission[]
  @Input() userPermissions: ObjMap<MappedPermission> = {}

  @Output() change: Observable<User>;
  @Output() removeUser: EventEmitter<User> = new EventEmitter<User>(false)
  @Output() addUserRole: EventEmitter<UserRole> = new EventEmitter<UserRole>(false)
  @Output() removeUserRole: EventEmitter<UserRole> = new EventEmitter<UserRole>(false)
  @Output() addUserPermission: EventEmitter<UserPermission> = new EventEmitter<UserPermission>(false)
  @Output() removeUserPermission: EventEmitter<UserPermission> = new EventEmitter<UserPermission>(false)


  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((v) => v === true)
      .map(() => new Event('focus'))

    this.change = distinct
      .filter((v) => v === false && this._changed)
      .map(() => this.user)

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(change: any) {
    if (change['userPermissions']) {
    }
  }

  doRemoveUser() {
    this.removeUser.emit(this.user)
  }

  doToggleRole(role: Role) {
    let userRole = {
      role_name: role.$key,
      user_uid: this.user.uid
    }
    if (this.userRoles[role.$key]) {
      this.removeUserRole.emit(userRole)
    } else {
      this.addUserRole.emit(userRole)
    }

  }

  doTogglePermission(permission: Permission) {
    let userPermission = {
      permission_name: permission.$key,
      user_uid: this.user.uid
    }
    if (this.userPermissions[permission.$key]) {
      this.removeUserPermission.emit(userPermission)
    } else {
      this.addUserPermission.emit(userPermission)
    }

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
    console.log("UserComponent", "onSubmit")
    this.submitted = true;
  }

  hasPermission(perm: Permission) {
    return !!this.userPermissions[perm.$key]
  }

  isExplicitlyGranted(perm: Permission) {
    let userPerm = this.userPermissions[perm.$key]
    return userPerm && userPerm.explicitlyGranted === true
  }

  isExplicitlyRevoked(perm: Permission) {
    let userPerm = this.userPermissions[perm.$key]
    return userPerm && userPerm.explicitlyRevoked === true
  }

}
