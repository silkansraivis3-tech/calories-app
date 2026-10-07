import nutritionData from './nutritionData.js';
function normalizeText(value) {
    return value.trim().toLowerCase();
}

export function findNutrition(foodName) {
    const normalizedName = normalizeText(foodName)
    const matches = nutritionData.flatMap((food) => 
        food.keywords
            .filter((keyword) => {
                const keywordPattern = new RegExp(`\\b${keyword}\\b`)
                return keywordPattern.test(normalizedName)
            })
            .map((keyword) => ({
                food,
                keyword
            }))
    )
    if (matches.length === 0) return null
    const uniqueFoods = [...new Set(matches.map((match) => match.food))]
    if(uniqueFoods.length > 1) return null
    matches.sort(
        (first, second) => 
            second.keyword.length - first.keyword.length
    )
    return matches[0].food
}

export function calculateIngredientCalories(ingredient) {
    const nutrition = findNutrition(ingredient.name)
    const parsedAmount = parseAmount(
        ingredient.amount, nutrition
    )
    if(!nutrition || !parsedAmount || parsedAmount.unit !== nutrition.unit) {
        return {
            ...ingredient,
            calories: null,
            matched: false
        }
    }
    const normalizedAmount = Number(parsedAmount.value.toFixed(2))
    const calories = Math.round((normalizedAmount / 100) * nutrition.caloriesPer100)
    return {
        ...ingredient,
        calories,
        matched: true,
        nutritionName: nutrition.name,
        amount: `${normalizedAmount}${nutrition.unit}`
    }
}
function parseAmount(amountText, nutrition) {
    const text = String(amountText).toLowerCase().trim()
    const match = text.match(/([\d.,]+)\s*(g|grams?|ml|milliliters?|tbsp|tablespoons?|tsp|teaspoons?|cups?)?/)
    if (!match) return null
    const value = Number.parseFloat(match[1].replace(',', '.'))
    const unit = match[2] ?? nutrition?.unit ??'g'
    if (Number.isNaN(value)) return null
    const productSpecificValue = nutrition?.conversions?.[unit]
    if(productSpecificValue) {
        return {
            value: value * productSpecificValue,
            unit: nutrition.unit
        }
    }
    const conversions = {
        g: {value, unit: 'g'},
        gram: { value, unit: 'g' },
        grams: { value, unit: 'g' },
        ml: { value, unit: 'ml' },
        milliliter: { value, unit: 'ml' },
        milliliters: { value, unit: 'ml' },
        tbsp: { value: value * 15, unit: 'ml' },
        tablespoon: { value: value * 15, unit: 'ml' },
        tablespoons: { value: value * 15, unit: 'ml' },
        tsp: { value: value * 5, unit: 'ml' },
        teaspoon: { value: value * 5, unit: 'ml' },
        teaspoons: { value: value * 5, unit: 'ml' },
        cup: { value: value * 240, unit: 'ml' },
        cups: { value: value * 240, unit: 'ml' }
    }
    return conversions[unit]
}
export function calculateTotalCalories(ingredients) {
    return ingredients.reduce((total,ingredient) => total + Number(ingredient.calories || 0),0)
}