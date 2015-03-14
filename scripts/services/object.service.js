'use strict';

angular.module('modelCompanyApp')
    .service('ObjectService', function(ColorService) {
            var self = this;
            self.occupationCategories = {
                "clerk & machinist": "mechanic",
                "farmer": "farmer",
                "boatman": "laborer",
                "carpenter": "laborer",
                "clerk": "professional",
                "bricklayer": "laborer",
                "shoemaker": "commercial",
                "moulder": "mechanic",
                "collier": "laborer",
                "saddler": "commercial",
                "blacksmith": "commercial",
                "cabinet maker": "commercial",
                "NA": "misc",
                "tailor": "commercial",
                "wagon maker": "commercial",
                "gentleman": "misc",
                "miller": "commercial",
                "teamster": "laborer",
                "laborer": "laborer",
                "Lime burner": "laborer",
                "railroader": "laborer",
                "schoolboy": "misc",
                "schoolmaster": "professional",
                "painter": "commercial",
                "hustler": "commercial",
                "plasterer": "laborer",
                "gardener": "commercial",
                "brick maker": "laborer"
            }
            var nationalAverages = {
                'age': 25,
                'height': 68,
                'hair': [{
                    'label': 'black',
                    'value': .13,
                    'percentage': 13
                }, {
                    'label': 'brown',
                    'value': .55,
                    'percentage': 55
                }, {
                    'label': 'light',
                    'value': .24,
                    'percentage': 24
                }, {
                    'label': 'sandy',
                    'value': .04,
                    'percentage': 4
                }, {
                    'label': 'red',
                    'value': .03,
                    'percentage': 3
                }, {
                    'label': 'gray',
                    'value': .01,
                    'percentage': 1
                }],
                'eyes': [{
                    'label': 'blue',
                    'value': .45,
                    'percentage': 45
                }, {
                    'label': 'gray',
                    'value': .24,
                    'percentage': 24
                }, {
                    'label': 'hazel',
                    'value': .13,
                    'percentage': 13
                }, {
                    'label': 'brown',
                    'value': .1,
                    'percentage': 10
                }, {
                    'label': 'black',
                    'value': .08,
                    'percentage': 8
                }],
                'complexion': [{
                    'label': 'light',
                    'value': .6,
                    'percentage': 60
                }, {
                    'label': 'dark',
                    'value': .33,
                    'percentage': 33
                }, {
                    'label': 'medium',
                    'value': .7,
                    'percentage': 70
                }],
                'occupation': [{
                    'label': 'farmer',
                    'value': .48,
                    'percentage': 48,
                    'children': []
                }, {
                    'label': 'mechanic',
                    'value': .24,
                    'percentage': 24,
                    'children': []
                }, {
                    'label': 'laborer',
                    'value': .16,
                    'percentage': 16,
                    'children': []
                }, {
                    'label': 'commercial',
                    'value': .05,
                    'percentage': 5,
                    'children': []
                }, {
                    'label': 'professional',
                    'value': .03,
                    'percentage': 3,
                    'children': []
                }, {
                    'label': 'misc',
                    'value': .04,
                    'percentage': 4,
                    'children': []
                }]}

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
                        var color = ColorService.getColor(attr, key);
                        var per = Math.round((parseInt(o) / data.length) * 100);
                        set.push({
                            'label': key,
                            'value': parseInt(o),
                            'percentage': per,
                            'color': color
                        })
                    })
                    return set;
                }
                this.constructWithFilter = function(data, attr, filter) {
                    var dataCopy = angular.copy(data);
                    if (filter) {
                        dataCopy = _.reject(dataCopy, function(d) {
                            return !filter[parseInt(d.mess)];
                        });
                    }
                    var attrs = _.pluck(dataCopy, attr);
                    var obj = {};
                    _.each(attrs, function(a) {
                        a = a.trim();
                        (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
                    });
                    var set = [];
                    _.each(obj, function(o, key) {
                        var color = ColorService.getColor(attr, key);
                        var per = Math.round((parseInt(o) / dataCopy.length) * 100);
                        set.push({
                            'label': key,
                            'value': parseInt(o),
                            'percentage': per,
                            'color': color
                        })
                    })
                    return set;
                }
                this.makeOccupationTree = function(data, attr, filter) {
                    var dataCopy = angular.copy(data);
                    if (filter) {
                        dataCopy = _.reject(dataCopy, function(d) {
                            return !filter[parseInt(d.mess)];
                        });
                    }
                    var attrs = _.pluck(dataCopy, attr);
                    var obj = {};
                    _.each(attrs, function(a) {
                        a = a.trim();
                        (obj[a] === undefined) ? obj[a] = 1: obj[a] ++;
                    });
                    var tree = angular.copy(nationalAverages[attr]);
                    _.each(obj, function(o, key) {
                        var parent = _.find(tree, function(d) {
                            return d.label === self.occupationCategories[key];
                        })
                        var color = ColorService.getColor(attr, key);
                        var per = Math.round((parseInt(o) / dataCopy.length) * 100);
                        parent.children.push({
                            'label': key,
                            'value': parseInt(o),
                            'percentage': per,
                            'color': color
                        })
                    })
                    var set = {
                        'name': 'flare',
                        'children': tree
                    };
                    return set;
                }
            });
