import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateIngredientCalories } from './nutritionCalculator.js'

test('calculates milk from milliliters', () => {
    const result = calculateIngredientCalories({
        name: 'Milk',
        amount: '50ml'
    })
    assert.equal(result.calories, 25)
    assert.equal(result.matched, true)
})
test('converts one tablespoon of cooking oil', () => {
    const result = calculateIngredientCalories({
        name: 'Cooking oil',
        amount: '1 tablespoon'
    })
    assert.equal(result.calories, 133)
    assert.equal(result.matched, true)
})
test('marks unknown ingredient for review', () => {
    const result = calculateIngredientCalories({
        name: 'Mystery food',
        amount: '100g'
    })
    assert.equal(result.calories, null)
    assert.equal(result.matched, false)
})