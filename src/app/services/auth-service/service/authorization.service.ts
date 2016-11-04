import {
  User,
  AuthServiceState,
  AuthStoreState,
  UserAuthTokenIF,
  Permission,
  Role
} from "@revector/auth-service";
import {
  Injectable,
  OnDestroy
} from "@angular/core";
import { Store } from "@ngrx/store";
import {
  Observable,
  Subscription
} from "rxjs";

export interface PermissionCheckResult {
  hasPermission: boolean
  userDoesNotExist?: string
  permissionDoesNotExist?: string
  reason?: string
}

export interface RoleCheckResult {
  hasRole: boolean
  userDoesNotExist?: string
  roleDoesNotExist?: string
  reason?: string
}

export const HAS_PERMISSION: string = "HAS_PERMISSION"

/**
 * Perhaps this is simply a utility class?
 */
@Injectable()
export class AuthorizationService implements OnDestroy {


  appState: AuthServiceState
  private _subscription:Subscription;

  constructor(public store: Store<AuthStoreState>) {
    this._subscription = store.select((s: AuthStoreState) => s.auth).subscribe((s: AuthServiceState) => this.appState = s)
  }

  ngOnDestroy(): void {
    this._subscription.unsubscribe()
  }

  hasRole(user: User, role: Role): boolean {
    return this.hasRoleByKey(user, role.$key)
  }

  hasRoleByKey(user: User, roleKey: string): boolean {
    return AuthorizationService._checkHasRole(user.uid, roleKey, this.appState).hasRole
  }

  hasPermission(user: User, permission: Permission): boolean {
    return this.hasPermissionByKey(user, permission.$key)
  }

  hasPermissionByKey(user: User, permissionKey: string) {
    return AuthorizationService._checkPermission(user, permissionKey, this.appState).hasPermission
  }


  static _checkHasRole(userUid: string, roleKey: string, appState: AuthServiceState): RoleCheckResult {
    let result: RoleCheckResult = {
      hasRole: false
    }

    result = Object.assign(result,
      AuthorizationService._userExists(userUid, appState),
      AuthorizationService._roleExists(roleKey, appState),
    )

    let skipCheck = result.roleDoesNotExist || result.userDoesNotExist

    if (!skipCheck) {
      result.hasRole = appState.user_roles[userUid][roleKey] === true
    }

    return result
  }


  static _checkPermission(user: User, permissionKey: string, appState: AuthServiceState): PermissionCheckResult {
    let result: PermissionCheckResult = {
      hasPermission: false
    }

    result = Object.assign(result,
      AuthorizationService._userExists(user.uid, appState),
      AuthorizationService._permissionExists(permissionKey, appState),
    )

    let skipCheck = result.permissionDoesNotExist || result.userDoesNotExist

    if (!skipCheck) {
      let userPerms = appState.user_permissions[user.uid]
      if (!userPerms) {
        result.reason = `Permission ${permissionKey} not granted`
      }
      else {
        let perm = userPerms[permissionKey]
        if (!perm || perm.explicitlyRevoked) {
          result.reason = `Permission ${permissionKey} ` + (!perm ? "not granted" : "explicitly revoked.")
        } else {
          result.hasPermission = true
        }
      }
    }
    return result
  }


  static _userExists(userUid: string, appState: AuthServiceState): {userDoesNotExist?: string} {
    return appState.users[userUid] ? {} : {userDoesNotExist: `No user with uid ${userUid}`}
  }

  static _permissionExists(permissionKey: string, appState: AuthServiceState): {permissionDoesNotExist?: string} {
    return appState.permissions[permissionKey] ? {} : {permissionDoesNotExist: `No permission with key ${permissionKey}`}
  }

  static _roleExists(roleKey: string, appState: AuthServiceState): {roleDoesNotExist?: string} {
    return appState.roles[roleKey] ? {} : {roleDoesNotExist: `No role with key ${roleKey}`}
  }

}
