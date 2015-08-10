/**
 * Created by ZTn on 09/08/2015.
 */

var basicMaterialsController = function ($scope) {
    $scope.items = [{name: "pffff", materialOf: "eh oh"}];
};

var BfCraft = {
    spheresRecipes: {},
    synthesisRecipes: {},

    allRecipes: {},
    allBasicMaterials: {},

    simplifiedSpheresRecipes: {},
    simplifiedSynthesisRecipes: {},

    synchronizeRecipesCount: 0,

    /**
     * Simplifies the recipes by reducing items used as material to their basic materials.
     * Warning: order of recipes matters !
     *
     * @param recipes
     */
    simplifyRecipes: function (recipes) {
        var simplifiedRecipes = angular.extend({}, recipes);

        $.each(recipes, function (recipe, materials) {
            $.each(materials, function (material, count) {
                if (material in recipes) {
                    delete materials[material];
                    $.each(recipes[material], function (subMaterial, subCount) {
                        if (subMaterial in materials != null) {
                            materials[subMaterial] += count * subCount;
                        }
                        else {
                            materials[subMaterial] = count * subCount;
                        }
                    })
                }
            });
        });

        return simplifiedRecipes;
    },

    /**
     * Finds the basic materials ie. those not crafted
     *
     * @param recipes
     * @returns {{}}
     */
    getBasicMaterials: function (recipes) {
        var basicMaterials = {};

        $.each(recipes, function (recipe, materials) {
            $.each(materials, function (material, count) {
                if (!(materials in recipes)) {
                    if (material in basicMaterials) {
                        basicMaterials[material].count++;
                        basicMaterials[material].materialOf.push(recipe);
                    }
                    else {
                        basicMaterials[material] = {material: material, count: 1, materialOf: [recipe]};
                    }
                }
            })
        });

        $.each(basicMaterials, function (index, value) {
            console.log(index + ": " + JSON.stringify(value));
        });

        return basicMaterials;
    },

    /**
     * Builds the allRecipes object if all recipes were successfully loaded.
     */
    synchronizeRecipes: function (callback) {
        var self = this;

        self.synchronizeRecipesCount++;
        if (self.synchronizeRecipesCount == 2) {
            BfCraft.simplifiedSynthesisRecipes = BfCraft.simplifyRecipes(BfCraft.synthesisRecipes);
            BfCraft.simplifiedSpheresRecipes = BfCraft.simplifyRecipes(BfCraft.spheresRecipes);

            angular.extend(self.allRecipes, self.synthesisRecipes);
            angular.extend(self.allRecipes, self.spheresRecipes);

            self.allBasicMaterials = self.getBasicMaterials(self.allRecipes);

            $.each(self.allRecipes, function (index, value) {
                console.log(index + ": " + JSON.stringify(value));
            });

            callback();
        }
    },
};
