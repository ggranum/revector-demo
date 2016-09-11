import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {User} from '../../../../services/auth-service'
import {Observable} from 'rxjs'


@Component({
  selector: 'rv-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserComponent {

  @Input() user: User

  @Output() change: Observable<User>;
  @Output() removeUser: EventEmitter<User> = new EventEmitter<User>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((v) => v === true)
      .map(() => new Event('focus'))

    this.change = distinct
      .filter((v) => v === false && this._changed)
      .map(() => this.user)

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))


  }

  doRemoveUser() {
    this.removeUser.emit(this.user)
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

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.user);
  }

}
