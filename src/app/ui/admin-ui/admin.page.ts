import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from "@angular/core";
import {
  Params,
  Router,
  ActivatedRoute
} from "@angular/router";
import {AuthStoreState} from "@revector/auth-service";
import {Store} from "@ngrx/store";

@Component({
  selector: 'rv-admin-page',
  template: `<div class='admin-page-content' layout="row" layout-align="center">
  <md-tab-group flex color="primary">
  <md-tab>
      <template md-tab-label>Users</template>
      <template md-tab-content>
        <rv-user-list></rv-user-list>
      </template>
    </md-tab>
    <md-tab>
      <template md-tab-label>Roles</template>
      <template md-tab-content>
        <rv-role-list></rv-role-list>
      </template>
    </md-tab>
    <md-tab>
      <template md-tab-label>Permissions</template>
      <template md-tab-content>
        <rv-permission-list></rv-permission-list>
      </template>
    </md-tab>
  </md-tab-group>
</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AdminPage {


  constructor(private route: ActivatedRoute, private router: Router, private _store: Store<AuthStoreState>) {
  }


  ngOnInit() {
    this.route.params.forEach((params: Params) => {
    });


  }

}
