'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md */

describe('index page', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it('should render the logo', function() {
    expect(element(by.css('.logo')).isDisplayed())
      .toBe(true);
  });

  it('should render the controls', function() {
    expect(element(by.css('.controls')).isDisplayed())
      .toBe(true);
  });

  it('should render the buttons', function() {
    element.all(by.buttonText('Individuals')).then(function(arr) {
        expect(arr.length).toEqual(1);
    });

    element.all(by.buttonText('Categories')).then(function(arr) {
        expect(arr.length).toEqual(1);
    });

    element.all(by.buttonText('Sort')).then(function(arr) {
        expect(arr.length).toEqual(1);
    });    
  });

  it('should switch attribute radio buttons', function() {

    // Categories

    expect(element(by.repeater('cat in categories').row(3)).getText())
      .toEqual('Enlistment');

    expect(element(by.repeater('cat in categories').row(0)).getText())
      .toEqual('Age');

    // Transition to individuals display
    element(by.id('individualsBtn')).click();

    expect(element(by.repeater('cat in categories').row(0)).getText())
      .toEqual('Age');

    expect(element(by.repeater('cat in categories').row(4)).isPresent())
      .toBe(false);

    // Back to categories
    element(by.id('categoriesBtn')).click();

    expect(element(by.repeater('cat in categories').row(4)).isPresent())
      .toBe(true);
  });

  it('should render the chart', function() {
    expect(element(by.css('.chart-container')).isDisplayed())
      .toBe(true);
  });

  it('should render the footer', function() {
    expect(element(by.css('.footer')).isDisplayed())
      .toBe(true);
  });

});

describe('d3 graph', function() {

  beforeEach(function() {
    browser.get('index.html');
  });

  it('should have text labels', function() {
    browser.findElements(by.css('text')).then(function(elems){
      expect(elems.length).not.toEqual(0);
    });
  });

  it('should have horizontal grids', function() {
    browser.findElements(by.css('line.horizontalGrid')).then(function(elems){
      expect(elems.length).not.toEqual(0);
    });
  });

  it('should have bars', function() {
    browser.findElements(by.css('.bar')).then(function(elems){
      console.log(elems.length)
      expect(elems.length).not.toEqual(0);
    });
  });
});

describe('routing', function() {

  browser.get('index.html');

  it('should automatically redirect to / when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/");
  });

  beforeEach(function() {
    browser.get('index.html#/about');
  });

  it('should render about when user navigates to /about', function() {
    expect(element.all(by.css('[ng-view] h4')).first().getText()).
      toMatch(/Model Company is/);
  });

});

