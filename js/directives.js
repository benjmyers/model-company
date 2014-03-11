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
directive('chart', ['detectMobile', '$window',
  function(detectMobile, $window) {
    return {
      restrict: 'A',
      scope: {
        data: "=",
        sets: "=", 
        displayattr: "=",
        averages: "="
      },
      link: function(scope, element, attrs) {

        if(detectMobile.get()){
          var lnk = document.createElement('link');
          lnk.type='text/css';
          lnk.href='css/mobile.css';
          lnk.rel='stylesheet';
          document.getElementsByTagName('head')[0].appendChild(lnk);
        }

        // The current display mode
        var individuals = false;

        /* --------------------------------- */
        /* ------------- Events -------------*/
        /* --------------------------------- */

        // Watch for soldier data changes and re-render
        scope.$watch('data', function(newVals, oldVals) {
          setCheckbox();
          if(newVals)
            return render(newVals, 'age');
          else
            return;
        }, false);

        // Re render when the displayed attribute changes
        scope.$on('updateDisplayValue', function(ev, displayValue){
          render(scope.data, displayValue);
        });

        // Order the categories from greatest to least
        scope.$on('changeOrder', function(ev, displayValue){
          change(scope.data, displayValue);
        });

        // Change display mode (individuals, categories) and re render
        scope.$on('changeDisplay', function(ev, display, displayValue, df){
          individuals = display;
          render(scope.data, displayValue);
          if(df)
            setCheckbox();
        });

        // Browser onresize event
        window.onresize = function() {
          scope.$apply();
        };
         // Watch for resize event & re render
        scope.$watch(function() {
          return angular.element(window)[0].innerWidth;
        }, function() {
          if(scope.data && scope.displayattr) {
            setup();
            render(scope.data, scope.displayattr);
          }
        });

        /* --------------------------------- */
        /* ---------- D3 Rendering ----------*/
        /* --------------------------------- */

        var width, height, x, y, xAxis, yAxis, svg;
        var margin = {
          top: 20,
          right: 20,
          bottom: 200,
          left: 40
        };

        // Grab labels and keys for individual display attributes
        var sets = scope.sets;

        // Sets up the D3 graph
        function setup() {

          // Remove the old SVG 
          d3.select('svg').remove();

          // Get important screen dimensions. Since the chart is the full height 
          // of the page, get window height. Width is dependent on bootstrap adusting
          // the size of .chart-container to 80%, so get that dimension
          var tHeight = angular.element(window)[0].innerHeight;
          tHeight-=tHeight*.1;
          var tWidth = parseInt(d3.select('.chart-container').style("width").split("px")[0]);

          // Set up SVG
          width = tWidth - margin.right - margin.left,
          height = tHeight - margin.top - margin.bottom;

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
            .attr("height", tHeight)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
          }

          // Kick off initial setup
          setup();

        // Renders the D3 graph
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
              return (d[display.y]) ? d[display.y] : undefined;
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
              return (rotateXlabels) ? "rotate(-90)" : "";
            })
            .attr("y", 0)
            .attr("dx", function(){
              return (rotateXlabels) ? "-1.2em" : ".5em";
            })
            .attr("dy", function(){
              return (rotateXlabels) ? ".3em" : "1.5em";
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
              return (individuals) ? sets[attr].dispkey : "Soldiers";
            });

          svg.selectAll("line.horizontalGrid")
          .data(y.ticks(5)).enter()
            .append("line")
              .attr("class","horizontalGrid")
              .attr("x1", margin.right/2)
              .attr("x2", width)
              .attr("y1", function(d){ return y(d) })
              .attr("y2", function(d){ return y(d) });

          // Remove invalid values
          if(individuals) {
            if(attr === "height" || attr === "age") {
              data = _.reject(data, function(d){
                return d[attr] === 0;
              });
            }
          }

          svg.selectAll(".bar")
            .data(data.y || data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d, index) {
              return (individuals) ? x(d[display.x]) : x(data.x[index]);
            })
            .attr("width", x.rangeBand())
            .attr("y", height)
            .attr("height", 0);

          // drawAverages(attr);

          // hide the domain paths because ugly
          d3.selectAll('path.domain').remove();

          fadeIn(data, display || {}, true);
        }

        // Draws averages on the graph
        function drawAverages(attr) {
          // Draw averages for age and height
          if(attr === 'age' || attr === 'height'){
            var nat = Math.floor(scope.averages[attr]);
            var co = Math.floor(scope.data.categories[attr].average[attr]);
            var offset = 0;
            if (co === nat)
              offset = 20;
            var x1, y1, x2, y2;
            if(individuals) {
              x1 = 0;
              x2 = width;
              y1 = y(nat);
              y2 = y(nat);
            }
            else {
              x1 = x(nat)+x.rangeBand()/2;
              x2 = x(nat)+x.rangeBand()/2;
              y1 = 0;
              y2 = height;
            }
            // draw national average
            appendLine('nat-average',
              x1, x2, y1, y2,
              "National");

            if(individuals) {
              x1 = 0;
              x2 = width;
              y1 = y(co);
              y2 = y(co);
            }
            else {
              x1 =  x(co)+x.rangeBand()/2
              x2 =  x(co)+x.rangeBand()/2;
              y1 = 0;
              y2 = height;
            }
            // Draw company average
            appendLine('company-average',
              x1, x2, y1, y2,
              "Company",
              offset);
          }
          /* This requires more thought on how to properly display averages
            else if(scope.averages.hasOwnProperty(attr)) {
            // draw national averages
            _.each(Object.keys(scope.averages[attr]), function(key) {
              var catAttr = scope.data.categories[attr];
              var natAvg = scope.averages[attr][key];
              var coAvg = catAttr.y[catAttr.x.indexOf(key)]/catAttr.total;
              //console.log(key+" "+natAvg+" "+coAvg+" "+y(natAvg*catAttr.total))
              if(natAvg && coAvg) {
                appendLine(key, 
                  margin.left,
                  width-margin.right, 
                  y(natAvg*catAttr.total), 
                  y(natAvg*catAttr.total),
                  key);
              }
            });
          }*/
        }
        // Adds a line to the graph
        function appendLine(className, x1, x2, y1, y2, label, offset) {
          if(!offset)
            var offset = 0;
          svg.append("line")
            .attr({
              "class": "appLine "+className,
              "x1" : x1,
              "x2" : x2,
              "y1" : y1,
              "y2" : y2
            });
          svg.append("text")
              .attr("class", "avgLine")
              .attr("y", y1+offset)
              .attr("x", x1)
              .attr("dy", "-0.2em")
              .style("text-anchor", "beginning")
              .text(label);   
        }
        // Fades in data via a transition
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
        // Fades out data via a transition
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
        // Orders data display from greatest to least
        function change(data, attr) {
          var display;
          var sortSet;
          var rotateXlabels = true;
          if(individuals){
            sortSet = data.individuals;
            display = sets[attr];
          }
          else {
            data = data.categories[attr];
            sortSet = _.sortBy(_.zip(data.y, data.x), function(n){return n[0]});
            if(_.size(data.x) < 7)
              rotateXlabels = false;
          }
          // Copy-on-write since tweens are evaluated after a delay.
          var x0 = x.domain(sortSet.sort(function(a, b) {
              return (individuals) ? b[display.y] - a[display.y] : b[0] - a[0];
            })
            .map(function(d) {
              return (individuals) ? d[display.x] : d[1];
            }))
            .copy();

          var transition = svg.transition().duration(750),
            delay = function(d, i) {
              return i * 10;
            };

          transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d, index) {
              return (individuals) ? x0(d[display.x]) : x0(data.x[index]);
            });

          transition.select(".x.axis")
            .call(xAxis)
            .selectAll("g")
            .delay(delay);

          // Reapply label styling as it's removed during the transition
          d3.selectAll(".x.axis text")
            .attr("y", 0)
            .attr("dx", function(){
              return (rotateXlabels) ? "-1.2em" : ".5em";
            })
            .attr("dy", function(){
              return (rotateXlabels) ? ".3em" : "1.5em";
            })
            .style("text-anchor", "end");
        }
        // Clears everything from the DOM
        function clear() {
          d3.selectAll('.x.axis').remove();
          d3.selectAll('.y.axis').remove();
          d3.selectAll('line').remove();
          d3.selectAll('.avgLine').remove();
        }
        // Clears bars only from the DOM
        function clearBars() {
          d3.selectAll('.bar').remove();
          d3.selectAll('line.horizontalGrid').remove();
        }
        // Sets a checkbox to checked
        function setCheckbox(attr) {
          d3.select('input').property('checked',true);
        }
      }
    }
  }
]);