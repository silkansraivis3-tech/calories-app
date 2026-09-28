import {
    calculateIngredientCalories,
    calculateTotalCalories
} from './nutritionCalculator.js'
export function createMockAnalysis(editedIngredients = null) {
    const ingredients = editedIngredients ?? [
        {
            name: 'Chicken breast',
            amount: '200g',
            calories: null,
        },
        {
            name: 'Asparagus',
            amount: '60g',
            calories: null
        },
        {
            name: 'Green peas',
            amount: '50g',
            calories: null
        },
        {
            name: 'Cream sauce',
            amount: '50ml',
            calories: null
        }
    ]
    const calculatedIngredients = ingredients.map(
        calculateIngredientCalories
    )
    return {
        foodName: 'Mock chicken meal',
        ingredients: calculatedIngredients,
        totalCalories: calculateTotalCalories(calculatedIngredients),
        confidence: 'low',
        assumptions: [
            'This is a mock response used for development.',
            'Unknown ingredients need manual calorie input'
        ]
    }
}