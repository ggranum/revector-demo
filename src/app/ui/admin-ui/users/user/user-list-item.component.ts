import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core'
import {Observable} from 'rxjs'
import {
  User,
  Role,
  UserRole,
  Permission,
  UserPermission,
  MappedPermission
} from '@revector/auth-service'
import {ObjMap} from '@revector/shared'


@Component({
  selector: 'rv-user-list-item-component',
  templateUrl: 'user-list-item.component.html',
  styleUrls: ['user-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemComponent {

  @Input() user: User
  @Input() roles: Role[]
  @Input() userRoles: ObjMap<boolean> = {}
  @Input() permissions: Permission[]
  @Input() userPermissions: ObjMap<MappedPermission> = {}

  @Input() showSelector: boolean = true
  @Input() selected: boolean = false
  @Input() expanded: boolean = false

  @Output() change: Observable<User>;
  @Output() selectionChange: EventEmitter<boolean> = new EventEmitter<boolean>(false)
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
      .filter((focused) => focused === true)
      .map(() => {
        this.expanded = true
        return new Event('focus')
      })

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => this.user)

    this.blur = distinct
      .filter((focused) => focused === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(change: any) {
  }

  doRemoveUser() {
    this.removeUser.emit(this.user)
  }

  doToggleRole(role: Role, enabled:boolean) {
    let userRole = {
      role_name: role.$key,
      user_uid: this.user.uid
    }
    if (enabled) {
      this.addUserRole.emit(userRole)
    } else {
      this.removeUserRole.emit(userRole)
    }

  }

  doTogglePermission(permission: Permission, userPermission:UserPermission, event:Event) {
    if(!userPermission){
      userPermission = {
        permission_name: permission.$key,
        user_uid: this.user.uid
      }
    }
    if (this.userPermissions[permission.$key]) {
      this.removeUserPermission.emit(userPermission)
    } else {
      this.addUserPermission.emit(userPermission)
    }
  }

  doToggleSelected() {
    this.selected = !this.selected
    this.selectionChange.emit(this.selected)
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



}
