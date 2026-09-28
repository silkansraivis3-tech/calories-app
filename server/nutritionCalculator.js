import nutritionData from './nutritionData.js';
function normalizeText(value) {
    return value.trim().toLowerCase();
}

export function findNutrition(foodName) {
    const normalizedName = normalizeText(foodName)
    return nutritionData.find((food) =>
    food.keywords.some((keyword) => {
        const keywordPattern = new RegExp(`\\b${keyword}\\b`)
        return keywordPattern.test(normalizedName)
        })
    )
}

export function calculateIngredientCalories(ingredient) {
    const nutrition = findNutrition(ingredient.name)
    const amount = Number.parseFloat(
        String(ingredient.amount).replace(',', '.')
    )
    if(!nutrition || Number.isNaN(amount)) {
        return {
            ...ingredient,
            calories: null,
            matched: false
        }
    }
    const calories = Math.round((amount/100) * nutrition.caloriesPer100)
    return {
        ...ingredient,
        calories,
        matched: true,
        nutritionName: nutrition.name,
    }
}
export function calculateTotalCalories(ingredients) {
    return ingredients.reduce((total,ingredient) => total + Number(ingredient.calories || 0),0)
}