'use strict';

var markDirective = angular.module('markDirective', [
    'ngRoute'
]);

/** 
 * {{username}}
 * logout()
 * <diy-user username= logout=></diy-user>
 */
markDirective.directive('diyUser', function () {
    return {
        restrict: 'E',
        scope: {
            username: '=',
            logout: '&'
        },
        templateUrl: 'component/diyUser.html'
    }
});
/**
 * @TODO update
 * save()
 * tinymceOptions
 * newPage
 */
markDirective.directive('diyEditor', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/diyEditor.html'
    }
})
/**
 * @TODO update
 * logout()
 */
markDirective.directive('diyMoremenu', function () {
    return {
        restrict: 'E',
        templateUrl: 'component/diyMoremenu.html'
    }
});
/**
 * 
 */
