import { ReVectorDemoPage } from './app.po';

describe('revector-demo App', function() {
  let page: ReVectorDemoPage;

  beforeEach(() => {
    page = new ReVectorDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
