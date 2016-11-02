import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {
  Role,
  Permission,
  AuthServiceState,
  User
} from '@revector/auth-service'
import {ObjMap} from "@revector/shared";


@Component({
  selector: 'rv-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  @Input() usersObj: {[key: string]: ObjMap<User>} = {}
  @Input() rolesObj: {[key: string]: ObjMap<Role>} = {}
  @Input() permissionsObj: {[key: string]: ObjMap<Permission>} = {}

  @Output() addUser: EventEmitter<User> = new EventEmitter<User>(false)
  @Output() userChange: EventEmitter<User> = new EventEmitter<User>(false)
  @Output() removeUser: EventEmitter<User> = new EventEmitter<User>(false)

  users: User[] = []
  roles: Role[] = []
  permissions: Permission[] = []

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change) {
    if (change.usersObj && this.usersObj) {
      let usersObj = change.usersObj.currentValue
      this.users = Object.keys(usersObj).map((key: string) => {
        return usersObj[key]
      })
    }
    if (change.rolesObj && this.rolesObj) {
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

  onRemoveUser(user: User) {
    this.removeUser.emit(user)
  }

  onChange(user: User) {
    if (user.uid) {
      this.userChange.emit(user)
    } else {
      this.addUser.emit(user)
    }
  }

  doAddUser() {
    let user: User = {
      createdMils: Date.now(),
      email: '',
      displayName: ''
    }
    this.addUser.emit(user)
  }

}
