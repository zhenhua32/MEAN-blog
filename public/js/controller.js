'use strict';

var markController = angular.module('markController', []);

markController.controller('registerC', ['$scope', 'registerS',
    function ($scope, registerS) {
        $scope.newName = null;
        $scope.newPassword = null;
        $scope.newEmail = null;
        //注册函数
        $scope.register = function () {
            var u = $scope.newName;
            var p = $scope.newPassword;
            var e = $scope.newEmail;
            registerS(u, p, e);
        }
    }
]);

markController.controller('loginC', ['$scope', '$rootScope', 'loginS', '$location',
    'isLoginS', 'getSessionS', 'getIconS',
    function ($scope, $rootScope, loginS, $location, isLoginS, getSessionS, getIconS) {
        $scope.userName = null;
        $scope.userPassword = null;
        //判断登录, promise
        isLoginS().then(
            function (response) {
                if (response.data.success) {
                    $location.path('/main');
                }
            });
        //登录函数
        $scope.login = function () {
            var u = $scope.userName;
            var p = $scope.userPassword;
            loginS(u, p);
            //显示姓名, promise, 只执行一次
            // getSessionS().then(
            //     function (result) {
            //         if ($rootScope.session) {
            //             $scope.username = $rootScope.session.user.name;
            //             $scope.avatar = $rootScope.session.user.avatar;
            //         } else {
            //             $scope.username = '网络错误, 无法显示#1';
            //             $scope.avatar = getIconS(200, 20, 0.85);
            //         }
            //     }, function (reason) {
            //         $scope.username = '网络错误, 无法显示#2';
            //         $scope.avatar = getIconS(200, 20, 0.85);
            //     });
        }
    }
]);

markController.controller('sidenavC', ['$scope', '$rootScope', '$mdSidenav', 'logoutS',
    'getSessionS', 'getIconS',
    function ($scope, $rootScope, $mdSidenav, logoutS, getSessionS, getIconS) {
        $scope.openLeftMenu = function () {
            $mdSidenav('sidenavLeft').toggle();
        };

        //显示姓名, promise, 只执行一次
        getSessionS().then(
            function (result) {
                if ($rootScope.session) {
                    $scope.username = $rootScope.session.user.name;
                    $scope.avatar = $rootScope.session.user.avatar;
                    // 补丁法, 其实因为是promise,而session又是必要条件 所以要预定顺序
                    // 强制再次触发 getPage()
                    // 可以尝试在登录成功的时候调用getSessionS函数
                    $rootScope.pageChange++;
                } else {
                    $scope.username = '网络错误, 无法显示#1';
                    $scope.avatar = getIconS(200, 20, 0.85);
                }
            }, function (reason) {
                $scope.username = '网络错误, 无法显示#2';
                $scope.avatar = getIconS(200, 20, 0.85);
            });

        $scope.items = [
            { index: 0, icon: 'create', title: '创作' },
            { index: 1, icon: 'archive', title: '所有文章' },
            { index: 2, icon: 'explore', title: '探索' }
        ];
        $scope.tabs = [
            { title: '创作', url: 'include/create.html' },
            { title: '所有文章', url: 'include/archive.html' },
            { title: '探索', url: 'include/explore.html' }
        ];
        $scope.selectedIndex = 0;
        $scope.toolbarTitle = '欢迎';

        $scope.select = function (index) {
            $scope.selectedIndex = index;
            $rootScope.pageChange++;
        }

        //注销函数, 好蛋疼, 不能直接用, 还要套个函数外壳, 不然就直接触发了
        /* for <diy-user> */
        $scope.logout = function () {
            logoutS();
        }

    }
]);


markController.controller('saveC', ['$scope', '$rootScope', '$mdToast', 'saveS', 'defaultTinymceOptions',
    function ($scope, $rootScope, $mdToast, saveS, defaultTinymceOptions) {
        //感觉这个 controller 不应该存在, 或者说太分散了, 或者名字不对
        /* for <diy-editor> */
        // init tinymce
        $scope.tinymceOptions = defaultTinymceOptions;

        $scope.newPage = {
            title: null,
            content: null
        }
        //保存文章
        $scope.save = function () {
            var t = $scope.newPage.title;
            var c = $scope.newPage.content;
            saveS(t, c).then(function success(response) {
                if (response.data.success) {
                    $mdToast.showSimple('新文章已保存!');
                    $rootScope.pageChange++;
                    //clear content
                    $scope.newPage = {
                        title: null,
                        content: null
                    }
                } else {
                    $mdToast.showSimple(response.data.message);
                }
            }, function errorCallback(response) {
                $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
            });

        }

    }
]);

markController.controller('archiveC', ['$scope', '$rootScope', 'getPageS', '$mdMedia', '$mdDialog', 'deleteS', '$mdToast',
    function ($scope, $rootScope, getPageS, $mdMedia, $mdDialog, deleteS, $mdToast) {

        function getPage() {
            if ($rootScope.session) {
                getPageS($rootScope.session.user._id).then(
                    function (result) {
                        if (result.data.success) {
                            $scope.pages = result.data.pages;
                            $scope.sum = result.data.pages.length;
                            $scope.orderProp = '-createdAt';
                        } else {
                            $scope.pages = []
                        }
                    }, function (reason) {
                        $scope.pages = []
                    });
            }

        }
        $rootScope.pageChange = 0;
        //稍微有点忧伤, 居然要自己写 watch, 不过还好比起不停更新要好些
        $rootScope.$watch('pageChange', function () {
            getPage();
        });

        //需要优化，数据量有点大，更新也频繁
        //可以不传递正文，然后在重新get具体文章
        //头像问题后面再说，不过一次http也可能是问题
        getPage();

        $scope.showEditor = function (event, page) {
            $mdDialog.show({
                controller: DialogController,
                templateUrl: 'include/editorDialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: true,
                locals: { page: page }
            })
        };
        //删除文章
        $scope.delete = function (id) {
            deleteS(id).then(
                function (result) {
                    $mdToast.showSimple('删除成功');
                    $rootScope.pageChange++;
                }, function (reason) {
                    $mdToast.show('删除失败');
                });
        }
    }
]);
function DialogController($scope, $rootScope, $mdDialog, updateS, page, $mdToast, defaultTinymceOptions) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
    /* for <diy-editor> */
    // init tinymce
    $scope.tinymceOptions = defaultTinymceOptions;

    $scope.newPage = {
        title: page.title,
        content: page.body
    }
    //保存文章
    $scope.update = function () {
        var t = $scope.newPage.title;
        var c = $scope.newPage.content;
        var id = page._id;
        updateS(t, c, id).then(
            function (result) {
                $mdToast.showSimple('保存成功');
                $rootScope.pageChange++;
                $mdDialog.cancel();
            }, function (reason) {
                $mdToast.showSimple('保存失败');
            });
    }

};

//only for unit test, not use
markController.controller('testC', ['$scope', '$rootScope', '$mdDialog', 'updateS', 'page',
    '$mdToast', 'defaultTinymceOptions', DialogController]);

markController.controller('exploreC', ['$scope', '$rootScope', 'getPageS', 'findPageS', 'countPageS', '$mdDialog',
    function ($scope, $rootScope, getPageS, findPageS, countPageS, $mdDialog) {
        //得到文章数据
        function getPage(skip) {
            findPageS(skip).then(
                function (result) {
                    if (result.data.success) {
                        $scope.pages = result.data.pages;
                    } else {
                        $scope.pages = []
                    }
                }, function (reason) {
                    $scope.pages = []
                });
        }
        //获得总数, 计算页数
        function countPage() {
            countPageS().then(
                function (result) {
                    if (result.data.success) {
                        $scope.sum = result.data.count;
                        $scope.pageNumber = Math.ceil($scope.sum / 5);
                    } else {
                        $scope.sum = 0;
                        $scope.pageNumber = 0;
                    }
                }, function (reason) {
                    $scope.sum = 0;
                    $scope.pageNumber = 0;
                });
        }
        $rootScope.pageChange = 0;
        //稍微有点忧伤, 居然要自己写 watch, 不过还好比起不停更新要好些
        $rootScope.$watch('pageChange', function () {
            getPage(0);
            countPage();
        });

        getPage(0);
        countPage();

        $scope.readMore = function (event, page) {
            $mdDialog.show({
                controller: ReadController,
                templateUrl: 'include/readDialog.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                locals: { page: page }
            })
        }


        //当前页数
        $scope.current = 1;

        $scope.go = function () {
            if ($scope.current < $scope.pageNumber) {
                getPage($scope.current * 5);
                $scope.current += 1;
            }
        }

        $scope.back = function () {
            if ($scope.current > 1) {
                getPage(($scope.current - 2) * 5);
                $scope.current -= 1;
            }
        }

    }
]);

function ReadController($scope, $rootScope, $mdDialog, page, $sce) {
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    $scope.newPage = {
        title: page.title,
        content: $sce.trustAsHtml(page.body),
        author: page.author.name
    }
}