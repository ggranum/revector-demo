import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceState, Permission} from '../../../../services/auth-service/index'
import {ObjMap} from '../../../../shared'



@Component({
  selector: 'rv-permission-list-component',
  templateUrl: 'permission-list.component.html',
  styleUrls: ['permission-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionListComponent {

  @Input() permissionsObj:{[key:string]: ObjMap<Permission>} = {}

  @Output() addPermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)
  @Output() permissionChange:EventEmitter<Permission> = new EventEmitter<Permission>(false)
  @Output() removePermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)

  permissions:Permission[] = []

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change){
    if(change.permissionsObj){
      let permissionsObj = change.permissionsObj.currentValue
      this.permissions = Object.keys(permissionsObj).map((key:string)=>{
        return permissionsObj[key]
      })
    }
  }

  onRemovePermission(permission:Permission){
    this.removePermission.emit(permission)
  }

  onChange(permission:Permission){
    if(permission.uid){
      this.permissionChange.emit(permission)
    } else{
      this.addPermission.emit(permission)
    }
  }

  doAddPermission(){
    let permission:Permission = { name: "", description: ""}
    this.addPermission.emit(permission)
  }

}
