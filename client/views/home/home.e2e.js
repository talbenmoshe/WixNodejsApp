'use strict';

dump('home test');
describe('home route', function () {

  beforeEach(function () {
    console.log('hello route');
    browser.get('/');
  });

  it('should have a basic content', function () {
    expect(element.all(by.css('div')).first().getText()).toBe('HomeCtrl');
  });
});