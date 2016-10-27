/* tslint:disable:no-unused-variable */

import {inject, TestBed} from '@angular/core/testing';
import {MainComponent} from './main.component';

describe('App: ReVectorDemo', () => {
  beforeEach(() => {
    TestBed.configureCompiler({providers: [MainComponent]});
  });

  it('should create the app',
    inject([MainComponent], (app: MainComponent) => {
      expect(app).toBeTruthy();
    }));

  it('should have as title \'ReVector Demo\'',
    inject([MainComponent], (app: MainComponent) => {
      expect(app.title).toEqual('ReVector Demo');
    }));
});
