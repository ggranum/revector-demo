import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from "@angular/core";
import {
  User,
  Role,
  Permission,
  PermissionGrant,
} from "@revector/auth-service";
import {ObjMap} from "@revector/shared";

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

  user: User = {
    displayName: "Demo user",
    email: "example@example.com",
    createdMils: Date.now(),
    uid: "abc12345abc234"
  }

  roles: Role[] = [
    {
      "$key": "DemoAdmin",
      "description": "Administrator",
      "orderIndex": 1,
    },
    {
      "$key": "DemoUser",
      "description": "DemoUser",
      "orderIndex": 10
    }, {
      "$key": "DemoGuest",
      "description": "DemoGuest",
      "orderIndex": 15
    }]

  permissions: Permission[] = [{
    "$key": "Add user",
    "description": "Create new users manually",
    "orderIndex": 1
  }, {
    "$key": "Remove user",
    "description": "Remove a user account",
    "orderIndex": 10
  }, {
    "$key": "Create permission",
    "description": "Create a new Permission",
    "orderIndex": 20
  }, {
    "$key": "Leave comment",
    "description": "Leave a comment.",
    "orderIndex": 30
  }, {
    "$key": "Remove comment",
    "description": "Remove any comment",
    "orderIndex": 40
  }, {
    "$key": "View comments",
    "description": "View public comments",
    "orderIndex": 50
  }, {
    "$key": "View own profile",
    "description": "View own profile page",
    "orderIndex": 60
  }]
  userRoles: ObjMap<boolean> = {"DemoUser": true, "DemoGuest": true}
  userPermissions: ObjMap<PermissionGrant> = {
    "Leave comment": {
      "$key": "Leave comment",
      "roles": {"DemoUser": true}
    },
    "View comments": {
      "$key": "View comments", "roles": {"DemoGuest": true, "DemoUser": true}
    },
    "View own profile": {
      "$key": "View own profile", "roles": {"DemoUser": true}
    },
    "Add user": {
      "$key": "Add user", "explicitlyGranted": true
    }
  }


  constructor() {
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

