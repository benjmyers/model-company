angular.module('modelCo.directives').
directive('piechart', ['detectMobile', '$window',
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
                //render()
                function render() {
                    // var data = {
                    //     labels: ['Bananas', 'Apples', 'Grapes'],
                    //     series: [20, 15, 40]
                    // };

                    var options = {
                      labelOffset: 50,
                      chartPadding: 10,
                        labelInterpolationFnc: function(value) {
                            return value
                        }
                    };

                    var responsiveOptions = [
                        ['screen and (min-width: 640px)', {
                            chartPadding: 30,
                            labelOffset: 100,
                            labelDirection: 'explode',
                            labelInterpolationFnc: function(value) {
                                return value;
                            }
                        }],
                        ['screen and (min-width: 1024px)', {
                            labelOffset: 80,
                            chartPadding: 20
                        }]
                    ];

                    new Chartist.Pie('.hair', scope.data, options);
                }
            }
        }
    }
]);
