import {Component, ChangeDetectionStrategy, Input, EventEmitter, Output} from '@angular/core'
import {Store} from '@ngrx/store'
import {AuthServiceState, User, UserState} from '../../../../services/auth-service'



@Component({
  selector: 'rv-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {

  @Input() usersObj:{[key:string]: UserState} = {}

  @Output() addUser: EventEmitter<User> = new EventEmitter<User>(false)
  @Output() userChange:EventEmitter<User> = new EventEmitter<User>(false)
  @Output() removeUser: EventEmitter<User> = new EventEmitter<User>(false)

  users:User[] = []

  constructor(private _store: Store<AuthServiceState>) {

  }

  ngOnChanges(change){
    if(change.usersObj && this.usersObj){
      let usersObj = change.usersObj.currentValue
      this.users = Object.keys(usersObj).map((key:string)=>{
        return usersObj[key]
      })
    }
  }

  onRemoveUser(user:User){
    this.removeUser.emit(user)
  }

  onChange(user:User){
    if(user.uid){
      this.userChange.emit(user)
    } else{
      this.addUser.emit(user)
    }
  }

  doAddUser(){
    let user:User = {
      createdMils: Date.now(),
      email: '',
      displayName: ''
    }
    this.addUser.emit(user)
  }

}
