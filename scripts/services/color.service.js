'use strict';

angular.module('modelCompanyApp')
    .service('ColorService', function() {
        var colors = {
            'hair' : {
                'brown': '#8a6f5b',
                'light': '#fee0ba',
                'black': '#4c4c4c',
                'gray': '#d8dddf',
                'sandy': '#bd986a',
                'red': '#b67966',
                'NA': '#eee'
            }, 
            'eyes' : {
                'blue': '#92c5de',
                'gray': '#d8dddf',
                'black': '#4c4c4c',
                'hazel': '#b98a67',
                'brown': '#8a6f5b',
                'NA': '#eee'
            },
            'complexion' : {
                'light': '#fee0ba',
                'medium': '#fccb8d',
                'dark': '#bd986a',
                'NA': '#eee'
            },
            'occupation': {
                'farmer': '#b2182b',
                'mechanic': '#ef8a62',
                'laborer': '#fddbc7',
                'commercial': '#d1e5f0',
                'professional': '#67a9cf',
                'misc': '#2166ac',
                'NA': '#eee'
            },
            'cause' : {
                'Mustered Out': '#2166ac',
                'Transferred': '#053061',
                'Discharged': '#4393c3',
                'Deserted': '#92c5de',
                'Wounded': '#67001f',
                'MIA': '#f4a582',
                'Died POW': '#d6604d',
                'Died': '#fddbc7',
                'KIA/Died Wounds': '#b2182b',
                'NA': '#eee'
            }
        };
        this.defaultColors = [
                '#67001f',
                '#b2182b',
                '#d6604d',
                '#f4a582',
                '#92c5de',
                '#4393c3',
                '#2166ac',
                '#053061'
            ];
        this.defaultScale = d3.scale.ordinal()
            .range(this.defaultColors);
        this.national = '#053061';
        this.company = '#b2182b';
        this.mess = '#d6604d';
        this.visualization = '#64889C';

        this.getColor = function(type, color) {
            if (type === 'hair' || type === 'eyes' || type === 'complexion' || type === 'occupation' || type === 'cause')
                return colors[type][color];
            else
                return undefined;
        }
    });
