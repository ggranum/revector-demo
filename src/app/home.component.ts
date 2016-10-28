import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core'
import {Observable} from "rxjs";
import {
  SignInState,
  User,
} from "@revector/auth-service";
import {Router} from "@angular/router";


@Component({
  selector: 'main-component',
  templateUrl: 'main.component.html',
  styleUrls: ['app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainComponent {
  @Input() user:User
  @Input() signInState:SignInState
  title = 'ReVector Demo'
  asciidoctorContent: string = ''
  errorMessage: Observable<string>

  constructor(private router: Router) {

  }


}



