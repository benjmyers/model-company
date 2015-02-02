angular.module('modelCompanyApp').
directive('pie', ['$window',
    function($window) {
        return {
            restrict: 'A',
            scope: {
                data: "=",
                attribute: "@",
                format: "@",
                mess: "@",
                format: "@"
            },
            link: function(scope, element, attrs) {
                scope.$watch('data', function(newVal) {
                    if (newVal)
                        render(newVal);
                });

                function render(data) {

                    if (scope.format === "true")
                        data = constructObj(angular.copy(data), scope.attribute, scope.mess);

                    data = _.sortBy(data, function(d) { return d.label; });
                    //Regular pie chart example
                    nv.addGraph(function() {
                     var chart = nv.models.pieChart()
                        .x(function(d) { return d.label })
                        .y(function(d) { return d.value })
                        .showLabels(true)     //Display pie labels
                        .labelThreshold(.1)  //Configure the minimum slice size for labels to show up
                        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
                        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
                        .tooltips(true)
                        .color([
                            '#d6604d',
                            '#4393c3',
                            '#f4a582',
                            '#92c5de',
                            '#fddbc7',
                            '#d1e5f0',
                            '#b2182b',
                            '#2166ac'
                        ]);
                        var classd = "."+scope.attribute;
                        if (scope.mess)
                            classd += scope.mess;
                        
                        d3.select(classd)
                            .datum(data)
                            .transition().duration(350)
                            .call(chart);

                      return chart;
                    });
                }

                function constructObj(data, attr, mess) {
                    if (mess)
                      data = _.reject(data, function(d) { console.log(d.mess !== mess); return d.mess !== mess; });
                    var attrs = _.pluck(data, attr);
                    var obj = {};
                    _.each(attrs, function(a) {
                        a = a.trim();
                        (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
                    });
                    var set = [];
                    _.each(obj, function(o, key) {
                        set.push({
                            'label': key,
                            'value': parseInt(o)
                        })
                    })
                    return set;
                }

            }
        }
    }
]);
