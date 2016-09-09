import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {Role} from '../../../../services/auth-service'
import {Observable} from 'rxjs'


@Component({
  selector: 'rv-role',
  templateUrl: 'role.component.html',
  styleUrls: ['role.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleComponent {

  @Input() role: Role

  @Output() change: Observable<Role>;
  @Output() removeRole: EventEmitter<Role> = new EventEmitter<Role>(false)

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
      .map(() => this.role)

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))


  }

  doRemoveRole() {
    this.removeRole.emit(this.role)
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
    console.log("RoleComponent", "onSubmit")
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.role);
  }

}
