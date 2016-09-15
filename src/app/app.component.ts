import {Component, ChangeDetectionStrategy} from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'ReVector Demo'
  asciidoctorContent: string = ''
  constructor() {
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
}



