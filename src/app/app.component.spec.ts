/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('App: ReVectorDemo', () => {
  beforeEach(() => {
    TestBed.configureCompiler({ providers: [AppComponent]});
  });

  it('should create the app',
    inject([AppComponent], (app: AppComponent) => {
      expect(app).toBeTruthy();
    }));

  it('should have as title \'ReVector Demo\'',
    inject([AppComponent], (app: AppComponent) => {
      expect(app.title).toEqual('ReVector Demo');
    }));
});
