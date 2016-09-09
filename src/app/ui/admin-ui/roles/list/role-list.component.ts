import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceState, Role} from '../../../../services/auth-service/index'
import {ObjMap} from '../../../../shared'



@Component({
  selector: 'rv-role-list-component',
  templateUrl: 'role-list.component.html',
  styleUrls: ['role-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleListComponent {

  @Input() rolesObj:{[key:string]: ObjMap<Role>} = {}

  @Output() addRole: EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() roleChange:EventEmitter<Role> = new EventEmitter<Role>(false)
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)

  roles:Role[] = []

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change){
    if(change.rolesObj){
      let rolesObj = change.rolesObj.currentValue
      this.roles = Object.keys(rolesObj).map((key:string)=>{
        return rolesObj[key]
      })
    }
  }

  onRemoveRole(role:Role){
    this.removeRole.emit(role)
  }

  onChange(role:Role){
    if(role.uid){
      this.roleChange.emit(role)
    } else{
      this.addRole.emit(role)
    }
  }

  doAddRole(){
    let role:Role = { name: "", description: ""}
    this.addRole.emit(role)
  }

}
