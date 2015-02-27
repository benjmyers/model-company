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
            }
        };

        this.getColor = function(type, color) {
            if (type === 'hair' || type === 'eyes' || type === 'complexion')
                return colors[type][color];
            else
                return undefined;
        }
    });
