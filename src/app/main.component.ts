import {
  Component,
  ChangeDetectionStrategy,
  Input
} from '@angular/core'
import {Observable} from "rxjs";
import {
  SignInState,
  User,
  AuthServiceStoreState,
  SignInStates
} from "@revector/auth-service";
import {Store} from "@ngrx/store";
import {safe} from "@revector/shared";
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
    this.asciidoctorContent = `
= Hello, AsciiDoc!
Doc Writer <doc@example.com>

An introduction to http://asciidoc.org[AsciiDoc].

== First Section

* item 1
* item 2

[source,ruby]
puts "Hello, World!"
`
  }


  signIn() {
    this.router.navigate(['./sign-in', {redirect:''}]);
  }

  isSignedIn(signInState: SignInState) {
    return signInState.state == SignInStates.signedIn
  }

}



