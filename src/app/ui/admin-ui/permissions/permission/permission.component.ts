import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {Permission} from '../../../../services/auth-service'
import {Observable} from 'rxjs'


@Component({
  selector: 'rv-permission',
  templateUrl: 'permission.component.html',
  styleUrls: ['permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionComponent {

  @Input() permission: Permission

  @Output() change: Observable<Permission>;
  @Output() removePermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)

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
      .map(() => this.permission)

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))


  }

  doRemovePermission() {
    this.removePermission.emit(this.permission)
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
    console.log("PermissionComponent", "onSubmit")
    this.submitted = true;
  }

  // TODO: Remove this when we're done
  get diagnostic() {
    return JSON.stringify(this.permission);
  }

}
