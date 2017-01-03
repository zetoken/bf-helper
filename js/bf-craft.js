/**
 * Created by ZTn on 09/08/2015.
 */

var BfCraft = {
    spheresRecipes: {},
    synthesisRecipes: {},
    translation: {},

    setSynthesisRecipes: function (recipes) {
        BfCraft.synthesisRecipes = BfCraft.translateRecipes(recipes);
    },

    setSphereRecipes: function (recipes) {
        BfCraft.sphereRecipes = BfCraft.translateRecipes(recipes);
    },

    setTranslation: function (translation) {
        BfCraft.translation = translation;
    },

    /**
     * Simplifies the recipes by reducing items used as material to their basic materials.
     * Warning: order of recipes matters !
     *
     * @param recipes
     */
    simplifyRecipes: function (recipes) {

        /**
         * Adds a material to a recipe (creates or updates)
         *
         * @param recipe
         * @param material
         * @param count
         */
        var addMaterialToRecipe = function (recipe, material, count) {
            if (material in recipe) {
                recipe[material] += count;
            }
            else {
                recipe[material] = count;
            }
        };

        var simplifiedRecipes = {};

        _.forEach(recipes, function (materials, recipe) {
            simplifiedRecipes[recipe] = {};
            _.forEach(materials, function (count, material) {
                if (material in simplifiedRecipes) {
                    _.forEach(simplifiedRecipes[material], function (subCount, subMaterial) {
                        addMaterialToRecipe(simplifiedRecipes[recipe], subMaterial, count * subCount);
                    })
                }
                else {
                    addMaterialToRecipe(simplifiedRecipes[recipe], material, count);
                }
            });
        });

        return simplifiedRecipes;
    },

    /**
     * Returns the materials ie. items used to craft other items
     *
     * @param recipes
     * @returns {<material>: {count:..., materialOf: [...]}}
     */
    getMaterials: function (recipes) {
        var allMaterials = {};

        _.forEach(recipes, function (materials, recipe) {
            _.forEach(materials, function (count, material) {
                if (material in allMaterials) {
                    allMaterials[material].count++;
                    allMaterials[material].materialOf.push(recipe);
                }
                else {
                    allMaterials[material] = {material: material, count: 1, materialOf: [recipe]};
                }
            })
        });

        return allMaterials;
    },

    /**
     * Returns all the recipes merged into a single object
     * @returns {*}
     */
    getAllRecipes: function () {
        return _.extend({}, BfCraft.synthesisRecipes || {}, BfCraft.spheresRecipes || {});
    },

    /**
     * Returns all simplified recipes merged into a single object
     * @returns {*}
     */
    getAllSimplifiedRecipes: function () {
        return BfCraft.simplifyRecipes(_.extend({}, BfCraft.synthesisRecipes, BfCraft.sphereRecipes));
    },

    /*
     * Translate the name of a material
     */
    translateName: function (name) {
        var nameTranslation = BfCraft.translation[name];
        if (nameTranslation) {
            return nameTranslation.name ? nameTranslation.name : name;
        }
        else {
            return name;
        }
    },

    /*
     * Translate the description of a material
     */
    translateDescription: function (name) {
        var nameTranslation = BfCraft.translation[name];
        if (nameTranslation) {
            return nameTranslation.description ? nameTranslation.description : "";
        }
        else {
            return "";
        }
    },

    translateRecipe: function (materials) {
        var translated = {};
        _.forEach(materials, function (count, material) {
            if (material in materials) {
                translated[BfCraft.translateName(material)] = count;
            }
            else {
                translated[material] = count;
            }
        });

        return translated;
    },

    translateRecipes: function (recipes) {
        var translatedRecipes = {};
        _.forEach(recipes, function (materials, recipe) {
            translatedRecipes[BfCraft.translateName(recipe)] = BfCraft.translateRecipe(materials);
        });
        return translatedRecipes;
    }
};
