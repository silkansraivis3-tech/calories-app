import { useEffect, useState } from 'react'
import './App.css'
function App() 
{
  const [caloriesInput, setCaloriesInput] = useState('')
  const [foodName, setFoodName] = useState('')
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals')
    return savedMeals ? JSON.parse(savedMeals) : []
  })
  const totalCalories = meals.reduce(
    (total, meal) => total + meal.calories,
    0
  )
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals))
  }, [meals])
  function handleAddCalories()
  {
    const calories = Number(caloriesInput)
    if (!foodName.trim() || calories <= 0) return
    const newMeal = 
    {
      id: Date.now(),
      name: foodName.trim(),
      calories
    }
    setMeals([...meals, newMeal])
    setCaloriesInput('')
    setFoodName('')
  }
  function handleDeleteMeal(mealId)
  {
    const updatedMeals = meals.filter((meal) => meal.id !== mealId)
    setMeals(updatedMeals)
  }
  return (
    <main>
      <h1>
        Calories App
      </h1>
      <p>
        Calories consumed today: {totalCalories} kcal
      </p>
      <label>
        Food:
        <input
          type="text"
          value={foodName}
          onChange={(event) => setFoodName(event.target.value)}
          placeholder="e.g. Alfredo Chicken"
        >
        </input>
      </label>
      <label>
        Calories:
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          minLength="1"
          value={caloriesInput}
          onChange={(event) => {
            const onlyDigits = event.target.value.replace(/\D/g, '')
            setCaloriesInput(onlyDigits)
          }}
        />
      </label>
      <button
        type="button"
        onClick={handleAddCalories}
      >
        Add Meal
      </button>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            {meal.name} - {meal.calories} kcal
            <button
              type="button"
              onClick={() => handleDeleteMeal(meal.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}
export default App