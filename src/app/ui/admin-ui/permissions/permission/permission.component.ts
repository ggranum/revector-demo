import {Component, ChangeDetectionStrategy, Input, Output, EventEmitter} from '@angular/core'
import {Observable} from 'rxjs'
import {Permission} from '../../../../services/auth-service'
import {Update} from '../../../../shared'


@Component({
  selector: 'rv-permission',
  templateUrl: 'permission.component.html',
  styleUrls: ['permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionComponent {

  @Input() permission: Permission

  @Output() change: Observable<Update<Permission>>;
  @Output() removePermission: EventEmitter<Permission> = new EventEmitter<Permission>(false)

  private _focusDebouncer: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  @Output() focus: Observable<Event>
  @Output() blur: Observable<Event>


  submitted = false;
  private _changed:boolean
  private _previous:Permission


  constructor() {
    let distinct: Observable<boolean> = this._focusDebouncer.asObservable()
    distinct = distinct.debounceTime(10).distinctUntilChanged()

    this.focus = distinct
      .filter((v) => v === true)
      .map(() => new Event('focus'))

    this.change = distinct
      .filter((focused) => focused === false && this._changed)
      .map(() => {
        let change = {
          previous: Object.assign({}, this._previous),
          current: Object.assign({}, this.permission)
        }
        this._previous = Object.assign({}, this.permission)
        this._changed = false
        return change
      })

    this.blur = distinct
      .filter((v) => v === false)
      .map(() => new Event('blur'))
  }

  ngOnChanges(change:any){
    if(change['permission']){
      this._previous = Object.assign({}, this.permission)
      this._changed = false
    }
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

}
