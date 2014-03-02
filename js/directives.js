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
directive('chart', ['d3Service', '$window',
  function(d3Service, $window) {
    return {
      restrict: 'E',
      scope: {
        data: "=",
        sets: "=", 
        displayattr: "="
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

        var width, height, x, y, xAxis, yAxis, svg;
        var margin = {
          top: 20,
          right: 20,
          bottom: 130,
          left: 40
        };
        var sets = scope.sets;

        var formatPercent = d3.format("d");

        function setup() {

          d3.select('svg').remove();

          var tWidth = angular.element(window)[0].innerWidth;
          var tHeight = angular.element(window)[0].innerHeight;

          // set up SVG

          width = tWidth - tWidth*0.15 - margin.right - margin.left,
          height = tHeight - tHeight*0.25 - margin.top - margin.bottom;

          x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1, 0);

          y = d3.scale.linear()
            .rangeRound([height, 0]);

          xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0,0)
            .orient("bottom");

          yAxis = d3.svg.axis()
            .scale(y)
            .ticks(5)
            .tickSize(0,0)
            .orient("left");

          svg = d3.select(".chart-container").append("svg")
            .attr("width", tWidth)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          }
          setup();

          // Browser onresize event
          window.onresize = function() {
            scope.$apply();
          };
           // Watch for resize event
          scope.$watch(function() {
            return angular.element(window)[0].innerWidth;
          }, function() {
            if(scope.data && scope.displayattr) {
              setup();
              render(scope.data, scope.displayattr);
            }
        });

        function render(data, attr) {
          clear();
          clearBars();
          var display;
          var rotateXlabels = true;
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
            if(_.size(data.x) < 7)
              rotateXlabels = false;
          }

          svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .attr("transform", function(){
              if(rotateXlabels)
                return "rotate(-90)";
              else
                return "";
            })
            .attr("y", 0)
            .attr("dx", function(){
              if(rotateXlabels)
                return "-1.2em";
              else
                return ".5em"
            })
            .attr("dy", function(){
              if(rotateXlabels)
                return ".3em";
              else
                return "1.5em";
            })
            .style("text-anchor", "end");

          svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", -height/2)
            .attr("dy", "-2.5em")
            .style("text-anchor", "end")
            .text(function() {
              if(individuals)
                return sets[attr].dispkey;
              else
                return "Soldiers"
            });

          svg.selectAll("line.horizontalGrid")
          .data(y.ticks(5)).enter()
            .append("line")
              .attr({
                "class":"horizontalGrid",
                "x1" : margin.right/2,
                "x2" : width,
                "y1" : function(d){ return y(d);},
                "y2" : function(d){ return y(d);}
              });

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

          // hide the domain paths because ugly
          d3.selectAll('path.domain').remove();

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
          d3.selectAll('line.horizontalGrid').remove();
        }
      }
    }
  }
]);