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

        var refresh = function (forceRefresh) {

            if (forceRefresh == undefined) {
                forceRefresh = false;
            }

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
                    if (forceRefresh == false && json != null) {
                        console.log(['Loading from LocalStorage:', url].join(' '));
                        resolve(angular.fromJson(json));
                    }
                    else {
                        console.log(['Refreshing from server:', url].join(' '));
                        // add a random number to file request to help prevent some browser cache overrides
                        url = [url, '?', Math.random()].join('');
                        $http.get(url, {cache: false})
                            .success(function (data) {
                                localStorage.setItem(key, angular.toJson(data));
                                resolve(data);
                            });
                    }
                })
            };

            var sphereRecipes = {};
            var synthesisRecipes = {};
            var translation = {};

            var loadSpheresPromise = loadJson('json/bf-spheres-recipes.json', 'bf-spheres-recipes')
                .then(function (data) {
                    sphereRecipes = data;
                });

            var loadSynthesisPromise = loadJson('json/bf-synthesis-recipes.json', 'bf-synthesis-recipes')
                .then(function (data) {
                    synthesisRecipes = data;
                });

            // TODO get the right translation file
            var loadTranslationPromise = loadJson('json/bf-items.fr.json', 'bf-items-lang')
                .then(function (data) {
                    translation = {}; // TODO set it to data object - default lang used for now
                });

            $q.all([loadSpheresPromise, loadSynthesisPromise, loadTranslationPromise])
                .then(function (results) {
                    BfCraft.setTranslation(translation);
                    BfCraft.setSphereRecipes(sphereRecipes);
                    BfCraft.setSynthesisRecipes(synthesisRecipes);
                    $scope.materials = BfCraft.getMaterials(BfCraft.getAllSimplifiedRecipes());
                });
        };

        $scope.refresh = refresh;

        refresh();
    }]);

    app.directive('bfMaterials', function () {
        return {
            restrict: 'E',
            templateUrl: 'bf-materials.html'
        }
    });
})();