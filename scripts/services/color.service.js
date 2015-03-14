'use strict';

angular.module('modelCompanyApp')
    .service('ColorService', function() {
        var colors = {
            'hair' : {
                'brown': '#8a6f5b',
                'light': '#fef7ef',
                'black': '#4c4c4c',
                'gray': '#d8dddf',
                'sandy': '#fcecd8',
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
                'light': '#fef7ef',
                'medium': '#fcecd8',
                'dark': '#fcdeba'
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
                'Deserted': '#b2182b',
                'Died': '#d6604d',
                'Discharged': '#f4a582',
                'In hosp.': '#fddbc7',
                'Killed': '#f7f7f7',
                'MIA': '#d1e5f0',
                'Mustered Out': '#92c5de',
                'NA': '#4393c3',
                'Transferred': '#2166ac',
                'Wounded': '#053061',
                'died wounds': '#67001f'
            }
        };

        //["Deserted", "Died", "Discharged", "In hosp.", "Killed", "MIA", "Mustered Out", "NA", "Transferred", "Wounded", "died wounds"]
        this.getColor = function(type, color) {
            if (type === 'hair' || type === 'eyes' || type === 'complexion' || type === 'occupation' || type === 'cause')
                return colors[type][color];
            else
                return undefined;
        }
    });
