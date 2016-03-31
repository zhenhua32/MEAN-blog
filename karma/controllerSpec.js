'use strict';

//那些直接定义在controller里的函数不能访问, 如果有效果的话则能从效果中推测
describe('markController', function() {
    beforeEach(module('markApp'));
    // beforeEach(module('markService'));
    // beforeEach(module('markController'));

    describe('registerC', function() {
        // 1.Defined out reference variable outside
        var $controller;

        // 2.Wrap the parameter in underscores
        // 下划线主要是用来注入服务, inject 会自动去掉下划线
        beforeEach(inject(function(_$controller_) {
            $controller = _$controller_;
        }));

        // 3.Use service in a series of tests
        it('test $scope.register', function() {
            //instantiating controllers
            var $scope = {};
            var controller = $controller('registerC', {
                $scope: $scope
            });

            spyOn($scope, 'register');

            $scope.newName = '123456';
            $scope.newPassword = '654321';
            $scope.newEmail = '123456@qq.com';

            expect($scope.newName).toEqual('123456');
            expect($scope.newPassword).toEqual('654321');
            expect($scope.newEmail).toEqual('123456@qq.com');

            $scope.register();
            expect($scope.register).toHaveBeenCalled();
        });
    });

    describe('loginC', function() {
        var $controller;
        var isLoginS;

        beforeEach(inject(function(_$controller_, _isLoginS_) {
            $controller = _$controller_;
            isLoginS = _isLoginS_;
        }));

        it('test $scope.login', function() {
            var $scope = {};

            var controller = $controller('loginC', {
                $scope: $scope,
                isLoginS: isLoginS
            });

            spyOn($scope, 'login');
            $scope.login();
            expect($scope.login).toHaveBeenCalled();
        })
    });

    describe('sidenavC', function() {
        var $controller;

        beforeEach(inject(function(_$controller_) {
            $controller = _$controller_;
        }));

        it('test all about sidenavC', function() {
            var $scope = {};

            var controller = $controller('sidenavC', {
                $scope: $scope
            });

            expect($scope.items).not.toBe(null);
            expect($scope.items).not.toBe(undefined);
            expect($scope.tabs).not.toBe(null);
            expect($scope.tabs).not.toBe(undefined);
            expect($scope.selectedIndex).toEqual(0);
            expect($scope.toolbarTitle).not.toBe(null);
            expect($scope.toolbarTitle).not.toBe(undefined);

            //with .and.callThrough() can actually execute
            spyOn($scope, 'select').and.callThrough();;

            $scope.select(1);
            expect($scope.select).toHaveBeenCalled();
            expect($scope.select).toHaveBeenCalledWith(1);
            expect($scope.selectedIndex).toEqual(1);

            spyOn($scope, 'openLeftMenu');
            $scope.openLeftMenu();
            expect($scope.openLeftMenu).toHaveBeenCalled();

            spyOn($scope, 'logout');
            $scope.logout();
            expect($scope.logout).toHaveBeenCalled();
        });
    });

    describe('saveC', function() {
        var $controller;

        beforeEach(inject(function(_$controller_) {
            $controller = _$controller_;
        }));

        it('test all about saveC', function() {
            var $scope = {};
            var $rootScope = { pageChange: 0 };

            var controller = $controller('saveC', {
                $scope: $scope,
                $rootScope: $rootScope
            });

            expect($scope.tinymceOptions).not.toBe(null);
            expect($scope.tinymceOptions).not.toBe(undefined);

            expect($scope.newPage.title).toBe(null);
            expect($scope.newPage.content).toBe(null);

            expect($rootScope.pageChange).toEqual(0);
            spyOn($scope, 'save').and.callThrough();
            $scope.save();
            expect($scope.save).toHaveBeenCalled();
            expect($rootScope.pageChange).toEqual(1);
        });
    });

    describe('archiveC', function() {
        var $controller;
        var $rootScope;

        beforeEach(inject(function(_$controller_, _$rootScope_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $rootScope.session = {
                user: {
                    _id: 'just for test'
                }
            }
        }));

        it('test all about archiveC', function() {
            var $scope = {};

            var controller = $controller('archiveC', {
                $scope: $scope,
                $rootScope: $rootScope
            });

            expect($rootScope.pageChange).toEqual(0);

            spyOn($scope, 'showEditor');
            $scope.showEditor('event', 'page');
            expect($scope.showEditor).toHaveBeenCalled();
            expect($scope.showEditor).toHaveBeenCalledWith('event', 'page');

            spyOn($scope, 'delete');
            $scope.delete('id');
            expect($scope.delete).toHaveBeenCalled();
            expect($scope.delete).toHaveBeenCalledWith('id');

        });
    });

    describe('DialogController', function() {
        var $controller;
        var page = {
            title: 'hello',
            body: 'world'
        };

        beforeEach(inject(function(_$controller_) {
            $controller = _$controller_;
        }));

        it('test all about DialogController', function() {
            var $scope = {};

            var controller = $controller('testC', {
                $scope: $scope,
                page: page
            });

            expect($scope.tinymceOptions).not.toBe(null);
            expect($scope.tinymceOptions).not.toBe(undefined);

            expect($scope.newPage.title).toEqual('hello');
            expect($scope.newPage.content).toEqual('world');

            spyOn($scope, 'hide');
            spyOn($scope, 'cancel');
            $scope.hide();
            $scope.cancel();
            expect($scope.hide).toHaveBeenCalled();
            expect($scope.cancel).toHaveBeenCalled();

            spyOn($scope, 'update');
            $scope.update();
            expect($scope.update).toHaveBeenCalled();
        });

    });

    describe('exploreC', function() {
        var $controller;
        var $rootScope;
        var $httpBackend;
        var $scope = {orderProp: '1', sum: 0};

        beforeEach(inject(function(_$controller_, _$rootScope_, _$httpBackend_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            $httpBackend = _$httpBackend_;

            $httpBackend.when('GET', '/api/page/all')
                .respond({
                    success: true,
                    pages: [
                        {title: '1', body: 'a'},
                        {title: '2', body: 'b'},
                        {title: '3', body: 'c'},
                    ]
                })
        }));
        //another way
        // beforeEach(inject(function($injector) {
        //     $controller = $injector.get('controller')
        // }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('test all about exploreC', function() {
            var controller = $controller('exploreC', {
                $scope: $scope
            });

            expect($rootScope.pageChange).toEqual(0);
            $rootScope.pageChange = 1;
            expect($rootScope.pageChange).toEqual(1);
            
            $httpBackend.flush();
            expect($scope.orderProp).toEqual('-createdAt');
            expect($scope.sum).toEqual(3);
            expect($scope.pages).not.toBe(null);
            expect($scope.pages).not.toBe(undefined);        
        });

    });
});
