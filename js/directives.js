'use strict';

/* Directives */

angular.module('modelCo.directives', []).
directive('appVersion', ['version',
  function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }
]).
directive('chart', ['d3Service',
  function(d3Service) {
    return {
      restrict: 'E',
      scope: {
        data: "=",
        sets: "="
      },
      link: function(scope, element, attrs) {
        var individuals = false;
        // watch for data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          if(newVals)
            return render(newVals, 'age');
          else
            return;
        }, false);

        // watch for displayed value
        scope.$on('updateDisplayValue', function(ev, displayValue){
          render(scope.data, displayValue);
        });

        scope.$on('changeOrder', function(ev, displayValue){
          change(scope.data, displayValue);
        });

        scope.$on('changeDisplay', function(ev, display, displayValue){
          individuals = display;
          render(scope.data, displayValue)
        });

        // set up SVG
        var margin = {
          top: 20,
          right: 20,
          bottom: 130,
          left: 40
        },
        width = 960 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

        var sets = scope.sets;

        var formatPercent = d3.format("d");

        var x = d3.scale.ordinal()
          .rangeRoundBands([0, width], .1, 0);

        var y = d3.scale.linear()
          .rangeRound([height, 0]);

        var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom");

        var yAxis = d3.svg.axis()
          .scale(y)
          .ticks(5)
          .orient("left");

        var svg = d3.select(".container").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function render(data, attr) {
          clear();
          clearBars();
          var display;
          if(individuals){
            data = data.individuals;
            display = sets[attr];
            x.domain(data.map(function(d) {
              return d[display.x];
            }));
            var min = d3.min(data, function(d) {
              if (d[display.y])
                return d[display.y];
              else
                return undefined;
            });
            var max = d3.max(data, function(d) {
              return d[display.y];
            });
            y.domain([min - 1, max]);
          }
          else {
            data = data.categories[attr];
            x.domain(data.x);
            y.domain([0, d3.max(data.y)]);
          }

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("dx", "-1.8em")
            .style("text-anchor", "end");

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(attr);

          svg.selectAll(".bar")
            .data(data.y || data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, index) {
              if(individuals)
                return x(d[display.x]);
              else
                return x(data.x[index]);
            })
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
              return height;
            })
            .attr("height", function(d) {
              return 0;
            });

          fadeIn(data, display || {}, true);
        }

        function fadeIn(data, display, inOrder) {
          var transition = svg.transition().duration(750),
            delay = function(d, i) {
              return i * 10;
            };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("y", function(d) {
              return y(d[display.y] || d);
            })
            .attr("height", function(d) {
              return height - y(d[display.y] || d);
            })
        }

        function fadeOut() {
          var transition = svg.transition().duration(750),
            delay = function(d, i) {
              return i * 10;
            };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("y", function(d) {
              return height;
            })
            .attr("height", function(d) {
              return 0;
            })
        }

        function change(data, attr) {
          var display;
          var sortSet;
          if(individuals){
            sortSet = data.individuals;
            display = sets[attr];
          }
          else {
            data = data.categories[attr];
            sortSet = _.sortBy(_.zip(data.y, data.x), function(n){return n[0]});
          }
          // Copy-on-write since tweens are evaluated after a delay.
          var x0 = x.domain(sortSet.sort(function(a, b) {
              if(individuals)
                return b[display.y] - a[display.y];
              else
                return b[0] - a[0];
            })
            .map(function(d) {
              if(individuals)
                return d[display.x];
              else
                return d[1];
            }))
            .copy();

          var transition = svg.transition().duration(750),
            delay = function(d, i) {
              return i * 10;
            };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d, index) {
              if(individuals)
                return x0(d[display.x]);
              else
                return x0(data.x[index])
            });

          transition.select(".x.axis")
            .call(xAxis)
            .selectAll("g")
            .delay(delay);
        }
        function clear() {
          d3.selectAll('.x.axis').remove();
          d3.selectAll('.y.axis').remove();
        }
        function clearBars() {
          d3.selectAll('.bar').remove();
        }
      }
    }
  }
]);