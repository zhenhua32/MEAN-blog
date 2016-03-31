'use strict';

describe('markService', function() {
    beforeEach(module('markApp'));

    it('check registerS availability', inject(function(registerS) {
        expect(registerS).toBeDefined();
    }));

    it('check loginS', inject(function(loginS) {
        expect(loginS).toBeDefined();
    }));

    it('check logoutS', inject(function(logoutS) {
        expect(logoutS).toBeDefined();
    }));

    it('check saveS', inject(function(saveS) {
        expect(saveS).toBeDefined();
    }));

    it('check getSessionS', inject(function(getSessionS) {
        expect(getSessionS).toBeDefined();
    }));

    it('check isLoginS', inject(function(isLoginS) {
        expect(isLoginS).toBeDefined();
    }));

    it('check getPageS', inject(function(getPageS) {
        expect(getPageS).toBeDefined();
    }));

    it('check updateS', inject(function(updateS) {
        expect(updateS).toBeDefined();
    }));

    it('check deleteS', inject(function(deleteS) {
        expect(deleteS).toBeDefined();
    }));

    it('check getIconS', inject(function(getIconS) {
        expect(getIconS).toBeDefined();
        // spy on function without object
        var spy = jasmine.createSpy('spy', getIconS).and.callThrough();
        var url = spy(200, 20, 0.85);
        expect(spy).toHaveBeenCalled();
        expect(url).toMatch(/data:image\/png;base64,.*/);
    }));

});