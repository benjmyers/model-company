angular.module('modelCo.directives').
directive('barchart', ['detectMobile', '$window',
    function(detectMobile, $window) {
        return {
            restrict: 'A',
            scope: {
                data: "="
            },
            link: function(scope, element, attrs) {

                scope.$watch('data', function(newVal) {
                  if (newVal)
                    render();
                }, true);
                function render() {
                  var options = {
                      high: _.max(scope.data.series[0]),
                      low: 0,
                      // axisX: {
                      //     labelInterpolationFnc: function(value, index) {
                      //         return index % 2 === 0 ? value : null;
                      //     }
                      // }
                  };
                  new Chartist.Bar('.ct-chart', scope.data, options);
                }
            }
        }
    }
]);
