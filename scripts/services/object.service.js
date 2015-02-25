'use strict';

angular.module('modelCompanyApp')
    .service('ObjectService', function() {
        this.construct = function(data, attr, mess) {
            if (mess)
                data = _.reject(data, function(d) {
                    return d.mess !== mess;
                });
            var attrs = _.pluck(data, attr);
            var obj = {};
            _.each(attrs, function(a) {
                a = a.trim();
                (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
            });
            var set = [];
            _.each(obj, function(o, key) {
                var per = Math.round((parseInt(o) / data.length) * 100);
                set.push({
                    'label': key,
                    'value': parseInt(o),
                    'percentage': per
                })
            })
            return set;
        }
    });
