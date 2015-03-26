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
                'red': '#b67966'
            }, 
            'eyes' : {
                'blue': '#92c5de',
                'gray': '#d8dddf',
                'black': '#4c4c4c',
                'hazel': '#b98a67',
                'brown': '#8a6f5b'
            },
            'complexion' : {
                'light': '#fee0ba',
                'medium': '#fccb8d',
                'dark': '#bd986a'
            },
            'occupation': {
                'farmer': '#b2182b',
                'mechanic': '#ef8a62',
                'laborer': '#fddbc7',
                'commercial': '#d1e5f0',
                'professional': '#67a9cf',
                'misc': '#2166ac'
            },
            'cause' : {
                'Mustered Out': '#2166ac',
                'Transferred': '#053061',
                'Discharged': '#4393c3',
                'Deserted': '#92c5de',
                'Wounded': '#67001f',
                'MIA/Unknown': '#f4a582',
                'Died POW': '#d6604d',
                'Died': '#fddbc7',
                'KIA/Died Wounds': '#b2182b'
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
            /* $blue: #7792a8;
$gray: #e5e8ec;
$white: #ffffff;
$red: #eb2a2e;
$brown: #503a25;
*/
        this.national = '#d6604d';
        this.company = '#4393c3';
        this.mess = '#92c5de';
        //["Deserted", "Died", "Discharged", "In hosp.", "Killed", "MIA", "Mustered Out", "NA", "Transferred", "Wounded", "died wounds"]
        this.getColor = function(type, color) {
            if (type === 'hair' || type === 'eyes' || type === 'complexion' || type === 'occupation' || type === 'cause')
                return colors[type][color];
            else
                return undefined;
        }
    });
