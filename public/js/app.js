'use strict';

var markAPP = angular.module('markApp', [
    'ngRoute',
    'ngCookies',
    'ngMessages',
    'ngMaterial',
    'ngSanitize',
    'markController',
    'markService',
    'markDirective',
    'markValue',
    'ui.tinymce'
]);

markAPP.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'
        })
        .accentPalette('pink', {
            'default': 'A200',
            'hue-1': 'A100',
            'hue-2': 'A400',
            'hue-3': 'A700'
        })
        .warnPalette('red', {
            'default': '500',
            'hue-1': '300',
            'hue-2': '800',
            'hue-3': 'A100'
        })
        .backgroundPalette('grey');
});

markAPP.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'partials/login.html'
            }).
            when('/main', {
                templateUrl: 'partials/main.html'
            }).
            otherwise({
                redirectTo: '/login'
            });
                
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
]);

