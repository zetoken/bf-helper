/**
 * Created by ZTn on 10/08/2015.
 */

(function () {
    var app = angular.module('bf-materials', []);

    app.controller('materialsController', ['$scope', '$http', '$q', function ($scope, $http, $q) {
        $scope.materials = [];

        $scope.predicate = '$key';
        $scope.reverse = false;
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        /**
         * Creates a promise loading json data from localStorage or an url
         *
         * @param url
         * @param key key of the data in the localStorage
         * @returns {*}
         */
        var loadJson = function (url, key) {
            return $q(function (resolve, reject) {
                var json = localStorage.getItem(key);
                if (json != null) {
                    resolve(angular.fromJson(json));
                }
                else {
                    $http.get(url)
                        .success(function (data) {
                            localStorage.setItem(key, angular.toJson(data));
                            resolve(data);
                        });
                }
            })
        };

        var loadSpheresPromise = loadJson('json/bf-spheres-recipes.json', 'bf-spheres-recipes')
            .then(function (data) {
                BfCraft.spheresRecipes = data;
            });

        var loadSynthesisPromise = loadJson('json/bf-synthesis-recipes.json', 'bf-synthesis-recipes')
            .then(function (data) {
                BfCraft.synthesisRecipes = data;
            });

        $q.all([loadSpheresPromise, loadSynthesisPromise])
            .then(function (results) {
                $scope.materials = BfCraft.getMaterials(BfCraft.getAllSimplifiedRecipes());
            });
    }]);

    app.directive('bfMaterials', function () {
        return {
            restrict: 'E',
            templateUrl: 'bf-materials.html'
        }
    })
})();