/**
 * Created by Ztn on 10/08/2015.
 */

(function () {
    var app = angular.module('bf', ['bf-materials']);

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
})();