import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from "@angular/core";
import {
  User,
  Role,
  UserRole,
  Permission,
  MappedPermission,
  RolePermissionsMappings,
  RoleModel,
  UserModel
} from "@revector/auth-service";
import {ObjMap} from "@revector/shared";
import {PermissionModel} from "../../../../services/auth-service/models/permission-model";

@Component({
  selector: 'rv-user-item-demo',
  template: `<h1>User Item Demo</h1>
<div class='demo-content' layout="row" layout-align="center">
  <rv-user-list-item-component  
    flex
    [user]="user"
    [roles]="roles"
    [userRoles]="userRoles"
    [permissions]="permissions"
    [userPermissions]="userPermissions"
    [showSelector]="true"
    (selectionChange)="onSelectionChange($event)"
    (removeUser)="onRemoveUser($event)"
    (addUserRole)="onAddUserRole($event)"
    (removeUserRole)="onRemoveUserRole($event)"
    (addUserPermission)="onAddUserPermission($event)"
    (removeUserPermission)="onRemoveUserPermission($event)"
  >
    
</rv-user-list-item-component>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class UserListItemDemo {

  roleMap: any = {
    "DemoAdmin": {
      description: "Administrator",
      orderIndex: 1
    },
    "DemoUser": {
      description: "DemoUser",
      orderIndex: 10
    },
    "DemoGuest": {
      description: "DemoGuest",
      orderIndex: 15
    }
  }


  permissionsMap: any =
  {
    "Add user": {
      description: "Create new users manually",
      orderIndex: 1
    },

    "Remove user": {
      description: "Remove a user account",
      orderIndex: 10
    },
    "Create permission": {
      description: "Create a new Permission",
      orderIndex: 20
    },
    "Leave comment": {
      description: "Leave a comment.",
      orderIndex: 30
    },
    "Remove comment": {
      description: "Remove any comment",
      orderIndex: 40
    },
    "View comments": {
      description: "View public comments",
      orderIndex: 50
    },
    "View own profile": {
      description: "View own profile page",
      orderIndex: 60
    }
  }


  user: User = {
    displayName: "Demo user",
    email: "example@example.com",
    createdMils: Date.now(),
    uid: "abc12345abc234"
  }

  roles: Role[] = []
  roleModels: RoleModel[]
  permissions: Permission[]
  rolePermissions: RolePermissionsMappings = {}
  userRoles: ObjMap<boolean> = {}
  userPermissions: ObjMap<MappedPermission> = {}



  constructor() {

    this.initPermissions();
    this.initRoles();

    this.userPermissions = {}
    let userModel = UserModel.from(this.user)
    userModel.assignRole(this.roleModels[1])
    userModel.assignRole(this.roleModels[2])
    userModel.grantPermission(PermissionModel.from(this.permissionsMap["Add user"]))

    this.userRoles = userModel.getUserRoles()
    this.userPermissions = userModel.getUserPermissions()

  }


  private initPermissions() {
    this.permissions = Object.keys(this.permissionsMap).map((key: string) => {
      this.permissionsMap[key].$key = key
      return this.permissionsMap[key]
    })
  }

  private initRoles() {
    this.roleModels = Object.keys(this.roleMap).map((key: string) => {
      let role = this.roleMap[key]
      role.$key = key
      let model = RoleModel.from(role, key)
      if (role === this.roleMap.DemoAdmin) {
        model.assignPermissions(...this.permissions)
      } else if (role === this.roleMap.DemoUser) {
        model.assignPermissions(this.permissionsMap["Leave comment"],
          this.permissionsMap["View comments"],
          this.permissionsMap["View own profile"])
      } else if (role === this.roleMap.DemoGuest) {
        model.assignPermissions(this.permissionsMap["View comments"])
      }
      this.roles.push(role)
      return model
    })
  }

  onSelectionChange(event: any) {
    console.log('UserListItemDemo', 'onSelectionChange', event)
  }

  onRemoveUser(event: any) {
    console.log('UserListItemDemo', 'onRemoveUser', event)
  }

  onAddUserRole(event: any) {
    console.log('UserListItemDemo', 'onAddUserRole', event)
  }

  onRemoveUserRole(event: any) {
    console.log('UserListItemDemo', 'onRemoveUserRole', event)
  }

  onAddUserPermission(event: any) {
    console.log('UserListItemDemo', 'onAddUserPermission', event)
  }

  onRemoveUserPermission(event: any) {
    console.log('UserListItemDemo', 'onRemoveUserPermission', event)
  }

}

