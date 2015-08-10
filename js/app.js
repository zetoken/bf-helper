/**
 * Created by Ztn on 10/08/2015.
 */

(function () {
    var app = angular.module('bf', []);

    /**
     * Workaround filter to sort object properties
     * Inspired from https://github.com/petebacondarwin/angular-toArrayFilter/blob/master/toArrayFilter.js
     */
    app.filter('toArray', function () {
        return function (anObject) {
            if (!angular.isObject(anObject)) {
                return anObject;
            }
            // Insert or update a $key property in anObject
            return Object.keys(anObject).map(function (key) {
                return Object.defineProperty(anObject[key], '$key', {__proto__: null, value: key})
            });
        }
    });

    app.controller('materialsController', ['$scope', '$http', function ($scope, $http) {
        var self = this;

        $scope.materials = [];

        $scope.predicate = '$key';
        $scope.reverse = false;
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $http.get('json/bf-synthesis.json')
            .success(function (data) {
                BfCraft.synthesisRecipes = data;
                BfCraft.synchronizeRecipes(self.update);
            });

        $http.get('json/bf-spheres.json')
            .success(function (data) {
                BfCraft.spheresRecipes = data;
                BfCraft.synchronizeRecipes(self.update);
            });

        this.update = function () {
            $scope.materials = BfCraft.allBasicMaterials;
        }
    }]);

})();