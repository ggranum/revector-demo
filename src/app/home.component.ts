import {
  Component,
  ChangeDetectionStrategy
} from "@angular/core";

@Component({
  selector: 'home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class HomeComponent {
  asciidoctorContent: string = ''

  constructor() {
    this.asciidoctorContent = `
= Welcome to the ReVector Demo 
Author <geoff.granum@gmail.com>

ReVector is a pack of reusable, individually installable components, packaged similarly to Angular Material2. The packaging is a work in progress, due to some modularity issues with webpack, but we're getting there.  

ReVector focuses on widgets that are completely functional - a sign-in dialog that uses Reactive style patterns via NgRxStore to allow users to create accounts and actually sign-in, for example. However, it is our intention to enable reuse of the visual, UX components as standalone, developer-modifiable widgets.

Some widgets, such as this one that is displaying AsciiDoc content, are purely UX; they have no dependencies on NgRx or on core/base service classes provided by ReVector. Others might have 'containers' that depend on NgRx and an active Firebase instance, but the component itself is consumable without those dependencies, such as sign-in-panel. 

So for now, please feel free to bounce around this demo. Create an account and sign in. Navigate to the link:./admin[admin console] 

== Frameworks & technologies used by various ReVector components: 

* https://angular.io[Angular2]
* https://github.com/angular/material2/[Angular Material 2]
* https://firebase.google.com[Firebase]
* https://github.com/ngrx/store[@ngrx]


== Flagship 'Component': User management and authorization services for apps that use Firebase for backend services.

Recreating authorization management for each new app you want to put on the web, bluntly, sucks. Firebase does a lot of the work for authentication management for us, but it doesn't provide permissions, roles, or content-level access control. So while it's great to not have to handle re-implementing the 27 different kinds of authorization... we still have to role our own access management. 

ReVector was started to pursue the primary goal of providing an off-the-shelf module for access control, usable in Angular2, Firebase hosted web-apps. Because access control is the most tedious, boring, and, unfortunately, critical aspect of site development. Even throw-away sites need *proper* access control if they happen to collect any user data at all. Creating Rules in Firebase is a great and necessary start, but it's not automatically user-friendly.
 
For now we'll have to refer you directly to the https://github.com/ggranum/revector-demo/tree/master/src/app/services/auth-service[source code]. At some point - assuming there's demand - we'll add additional details describing the implementation.  

== Available/proposed components:

[options="header"]
|============================================================================================
|                                  |Demo                              |Status
|Sign-in Panel                     |link:./demo/sign-in-panel[link]   |Ready / Needs I18N
|Sign-in Panel w/firebase          |link:./sign-in[link]              |Needs Tests
|AsciiDoctor Panel                 |link:./demo/ascii-doctor[link]    |Ready, Needs Improvement
|http://asciimath.org/[AsciiMath]  |                                  |Proposed
|============================================================================================


`
  }


}



