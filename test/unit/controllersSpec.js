'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function(){

  var scope;

  beforeEach(function() {
    window.testing = true;
    module('modelCo.controllers');
  });

  beforeEach(inject(function($rootScope, $controller){
      //create an empty scope
      scope = $rootScope.$new();
      // inject
      $controller('ChartCtrl', {$scope: scope});
  }));

  it('should have undefined variable data', function(){
        expect(scope.data).toBe(undefined);
  });

  it('should have variable displayValue = "age"', function(){
        expect(scope.displayValue).toBe("age");
  });

  it('should have variable displayMode = "false"', function(){
        expect(scope.displayMode).toBe(false);
  });

  it('should have an object averages with key age', function(){
        expect(Object.keys(scope.averages)[0]).toBe('age');
  });

});
