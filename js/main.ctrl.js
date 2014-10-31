angular.module('modelCo.controllers').
controller('MainCtrl', ['$scope', '$http', '$q', '$timeout', '$location', function($scope, $http, $q, $timeout, $location) {

    // Returns all data from the soldier csv
    $scope.getData = function() {
            var report = $q.defer();
            var fileLoc = "data/formatted-messes.csv";
            if (window.testing) {
                fileLoc = "base/data/formatted-messes.csv";
            }
            $timeout(function() {
                d3.csv(fileLoc, function(error, data) {
                    report.resolve(data);
                });
            }, 1000);
            return report.promise;
        }
        // Iterages through each data point and performs necessary parsing and adjustments
    $scope.parseData = function(data) {
        _.each(data, function(d) {
            // Dates are 100 years off, correct
            var dateIn = new Date(d.datein.trim());
            var dateOut = new Date(d.dateout.trim());
            var correctedIn = dateIn.getFullYear() - 100;
            var correctedOut = dateOut.getFullYear() - 100;
            var cDateIn = dateIn.setFullYear(correctedIn);
            var cDateOut = dateOut.setFullYear(correctedOut);
            d.datein = new Date(cDateIn).toDateString();
            d.dateout = new Date(cDateOut).toDateString();
            // parse integer attrs
            d.mess = +parseInt(d.mess);
            d.age = +parseInt(d.age);
            d.height = +parseInt(d.heightin);
        });
    }
     // Creates the object containing categorical information
    $scope.makeCategories = function(data) {
      var categories = {
        mess: {x: [], y: [], dispkey: "Mess", key: "mess"},
        datein: {x: [], y: [], dispkey: "Enlistment", key: "datein"},
        dateout: {x: [], y: [], dispkey: "Date of exit", key: "dateout"},
        cause: {x: [], y: [], dispkey: "Exit Reason", key: "cause"},
        age: {x: [], y: [], dispkey: "Age", key: "age"},
        height: {x: [], y: [], dispkey: "Height", key: "height"},
        complexion: {x: [], y: [], dispkey: "Complexion", key: "complexion"},
        eyes: {x: [], y: [], dispkey: "Eye Color", key: "eyes"},
        hair: {x: [], y: [], dispkey: "Hair Color", key: "hair"},
        occupation: {x: [], y: [], dispkey: "Occupation", key: "occupation"},
        home: {x: [], y: [], dispkey: "Home", key: "home"}
      };
      $scope.categories = categories;
      _.each(data, function(d) {
        _.each(Object.keys(categories), function(key){
          var item = d[key];
          if(typeof item === "string")
            item = item.trim();
          var object = categories[key];
          var index = object.x.indexOf(item);
          if(index === -1) {
            object.x.push(item);
            object.y.push(1);
          }
          else
            object.y[index]++;
        })
      });
      return categories;
    }

         // Initiate load sequence
    $scope.getData().then(function(data){
      $scope.parseData(data);
      var categories = $scope.makeCategories(data);
      // $scope.heights = {
      //   'labels': _.toArray(_.pluck(data, 'name')),
      //   'series': [_.toArray(_.pluck(data, 'height'))]
      // }
      $scope.heights = {
        'labels': _.toArray(categories.height.x),
        'series': [_.toArray(categories.height.y)]
      }
      $scope.hair = {
        'labels': _.toArray(categories.hair.x),
        'series': _.toArray(categories.hair.y)
      }
      console.log(categories)

      $scope.data = data;
    });

}])
