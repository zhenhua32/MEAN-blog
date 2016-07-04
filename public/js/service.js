'use strict';

var markService = angular.module('markService', []);

//maybe should return promise
markService.factory('registerS', ['$http', '$location', '$mdToast', 'getIconS',
    function($http, $location, $mdToast, getIconS) {
        return function(userName, userPassword, userEmail) {
            var request = {
                method: 'POST',
                url: '/api/register',
                data: {
                    newName: userName,
                    newPassword: userPassword,
                    newEmail: userEmail,
                    avatar: getIconS(200, 20, 0.85)
                }
            };
            $http(request).then(function successCallback(response) {
                //status code 200-299
                if (response.data.success) {
                    $location.path('/main');
                    $mdToast.showSimple('成功注册, 正在登录!');
                } else {
                    $mdToast.showSimple(response.data.message);
                }
            }, function errorCallback(response) {
                $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
            });
        }
    }
]);

markService.factory('loginS', ['$http', '$location', '$mdToast',
    function($http, $location, $mdToast) {
        return function(userName, userPassword) {
            var request = {
                method: 'POST',
                url: '/api/login',
                data: {
                    userName: userName,
                    userPassword: userPassword,
                }
            };
            $http(request).then(function successCallback(response) {
                //status code 200-299
                if (response.data.success) {
                    $location.path('/main');
                    $mdToast.showSimple('登录成功!');
                    //可以尝试在登录成功的时候调用getSessionS函数

                } else {
                    $mdToast.showSimple(response.data.message);
                }
            }, function errorCallback(response) {
                $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
            });
        }
    }
]);

markService.factory('logoutS', ['$http', '$location', '$mdToast','$rootScope',
    function($http, $location, $mdToast, $rootScope) {
        return function() {
            $http.get('/api/logout').then(function successCallback(response) {
                if (response.data.success) {
                    $location.path('/login');
                    $mdToast.showSimple('注销成功!');
                    $rootScope.session = null;
                }
            }, function errorCallback(response) {
                $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
            });
        }
    }
]);

markService.factory('saveS', ['$http', '$mdToast',
    function($http, $mdToast) {
        return function(title, content) {
            var request = {
                method: 'POST',
                url: '/api/page/new',
                data: {
                    title: title,
                    content: content
                }
            };
            return $http(request);
            // $http(request).then(function successCallback(response) {
            //     if (response.data.success) {
            //         $mdToast.showSimple('新文章已保存!');
            //         return true;
            //     } else {
            //         $mdToast.showSimple(response.data.message);
            //         return fasle;
            //     }
            // }, function errorCallback(response) {
            //     $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
            //     return false;
            // });
        }
    }
]);

//真忧伤, 把逻辑行为和表现层混在一起了, 似乎不该用 mdToast
markService.factory('getSessionS', ['$http', '$mdToast', '$rootScope', '$q',
    function($http, $mdToast, $rootScope, $q) {
        return function() {
            var promise = $http.get('/api/session').then(
                function successCallback(response) {
                    if (response.data.success) {
                        $rootScope.session = response.data.session;
                    } else {
                        $mdToast.showSimple(response.data.message);
                        $rootScope.session = null;
                        //fail
                        return $q.reject(response.data.message);
                    }
                }, function errorCallback(response) {
                    $mdToast.showSimple('网络错误或服务器连不上, 稍后再试');
                    $rootScope.session = null;
                    //fail
                    return $q.reject('网络错误或服务器连不上, 稍后再试');
                });

            return promise;
        }
    }
]);

//$http 是 promise, 在这里调用 then 然后 return 似乎不能返回值, 只能返回 promise 了
markService.factory('isLoginS', ['$http',
    function($http, $mdToast, $q) {
        return function() {
            return $http.get('/api/session/islogin');
        }
    }
]);

markService.factory('findPageS', ['$http',
    function($http) {
        return function(skip, limit) {
            if (arguments.length == 1) {
                return $http.get('/api/page/find?limit=5&skip=' + skip);
            } else {
                return $http.get('/api/page/find?skip=' + skip + '&limit=' + limit);
            }

        }
    }
]);

markService.factory('countPageS', ['$http',
    function($http) {
        return function(uid) {
            if (uid) {
                return $http.get('/api/page/count/' + uid);
            } else {
                return $http.get('/api/page/count');
            }
        }
    }
]);

markService.factory('getPageS', ['$http',
    function($http) {
        return function(uid) {
            if (uid) {
                return $http.get('/api/page/all/' + uid);
            } else {
                return $http.get('/api/page/all');
            }
        }
    }
]);

markService.factory('updateS', ['$http',
    function($http) {
        return function(title, content, id) {
            var request = {
                method: 'POST',
                url: '/api/page/update',
                data: {
                    title: title,
                    content: content,
                    id: id
                }
            };
            return $http(request);
        }
    }
]);

markService.factory('deleteS', ['$http',
    function($http) {
        return function(id) {
            var request = {
                method: 'DELETE',
                url: '/api/page/delete/' + id,
            };
            return $http(request);
        }
    }
]);

markService.factory('getIconS', ['$window', '$document',
    function($window, $document) {
        return function(length, step, random) {
            var canvas = $window.document.createElement('canvas');
            canvas.width = canvas.height = length;
            var ctx = canvas.getContext('2d');

            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);

            var i = 0;
            var j = 0;
            for (; i < length; i += step) {
                for (j = 0; j < length; j += step) {
                    if (Math.random() > random) {
                        ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')';
                    } else {
                        ctx.fillStyle = 'rgb(255,255,255)';
                    }
                    ctx.fillRect(i, j, step, step);
                }
            }
            return canvas.toDataURL('image/png');
        }
    }
]);