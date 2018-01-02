import { CompareEthPage } from './app.po';

describe('compare-eth App', () => {
  let page: CompareEthPage;

  beforeEach(() => {
    page = new CompareEthPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
