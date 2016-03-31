'use strict';

describe('markDirective', function() {
    beforeEach(module('markApp'));
    beforeEach(module('nghtml2js'));
    beforeEach(module('markDirective'));

    var $compile;
    var $rootScope;

    beforeEach(inject(function(_$compile_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('Replaces the element with the appropriate content', function() {
        // Compile a piece of HTML containing the directive
        var element = $compile("<diy-user></diy-user>")($rootScope);
        // fire all the watches
        $rootScope.$digest();
        // Check that the compiled element contains the templated content
        expect(element.html()).toMatch(/^<span.*/);
        // console.log(element.html())
    });
    
    it('test diyEditor', function() {
        var element = $compile("<diy-editor></diy-editor>")($rootScope);
        $rootScope.$digest();
        expect(element.html()).toMatch(/^<form name="pageForm".*/);
    });
    
    it('test diyMoremenu', function() {
       var element = $compile("<diy-moremenu></diy-moremenu>")($rootScope);
       $rootScope.$digest();
       expect(element.html()).toMatch(/^<md-menu.*/);
    });
});