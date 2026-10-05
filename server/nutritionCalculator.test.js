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
test('marks ambigous ingredient for review', () => {
    const result = calculateIngredientCalories({
        name: 'Cooking oil / butter',
        amount: '1 tablespoon'
    })
    assert.equal(result.calories, null)
    assert.equal(result.matched, false)
})
test('converts one teablespoon of butter', () => {
    const result = calculateIngredientCalories({
        name: 'Butter',
        amount: '1 tablespoon'
    })
    assert.equal(result.calories, 100)
    assert.equal(result.matched, true)
})
test('uses milk default unit when amount has no unit', () => {
    const result = calculateIngredientCalories({
        name: 'Milk',
        amount: '200'
    })
    assert.equal(result.calories, 100)
    assert.equal(result.matched, true)
})
test('converts one teaspoon of butter', () => {
  const result = calculateIngredientCalories({
    name: 'Butter',
    amount: '1 teaspoon'
  })

  assert.equal(result.calories, 34)
  assert.equal(result.matched, true)
})

test('converts one cup of milk', () => {
  const result = calculateIngredientCalories({
    name: 'Milk',
    amount: '1 cup'
  })

  assert.equal(result.calories, 120)
  assert.equal(result.matched, true)
})

test('calculates chicken from grams', () => {
  const result = calculateIngredientCalories({
    name: 'Chicken breast',
    amount: '50 grams'
  })

  assert.equal(result.calories, 83)
  assert.equal(result.matched, true)
})

test('supports decimal comma in tablespoon amount', () => {
  const result = calculateIngredientCalories({
    name: 'Cooking oil',
    amount: '1,5 tablespoon'
  })

  assert.equal(result.calories, 199)
  assert.equal(result.matched, true)
})