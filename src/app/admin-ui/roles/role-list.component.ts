import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthActions, AuthServiceState, Role} from '../../auth-service'
import {RoleActions} from '../../auth-service/state/role/role.actions'



@Component({
  selector: 'rv-role-list-component',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {

  @Input() rolesObj:{[key:string]: Map<string, Role>} = {}
  roles:Role[] = []

  constructor(private _store: Store<AuthServiceState>, public appActions:AuthActions) {

  }

  ngOnChanges(change){

    if(change.rolesObj){
      let rolesObj = change.rolesObj.currentValue
      this.roles = Object.keys(rolesObj).map((key:string)=>{
        console.log("RoleAdminPanelComponent", rolesObj[key])
        return rolesObj[key]
      })
    }
  }

  addRole(name:string, description:string){
    let role:Role = { name, description }
    this._store.dispatch(RoleActions.addRole.invoke.action(role))
  }

}
