import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {Store} from '@ngrx/store'

import {AuthServiceState, UserInfo, AuthActions, User} from '../../auth-service'


@Component({
  selector: 'rv-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['user-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  @Input() usersObj: {[key: string]: Map<string, User>} = {}
  users: UserInfo[] = []

  constructor(private _store: Store<AuthServiceState>, public appActions: AuthActions) {

  }

  ngOnChanges(change) {

    if (change.usersObj) {
      let usersObj = change.usersObj.currentValue
      if (usersObj) {
        this.users = Object.keys(usersObj).map((key: string) => {
          console.log("UserComponent", usersObj[key].info)
          return usersObj[key].info
        })

      } else {
        this.users = []
      }
    }
  }

}
