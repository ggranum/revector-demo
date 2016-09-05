import { GgranumComPage } from './app.po';

describe('ggranum-com App', function() {
  let page: GgranumComPage;

  beforeEach(() => {
    page = new GgranumComPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
