import { useEffect, useState } from 'react'
import './App.css'
function getToday()
{
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
function App() 
{
  const [caloriesInput, setCaloriesInput] = useState('')
  const [foodName, setFoodName] = useState('')
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals')
    if (!savedMeals) return []
    const storedMeals = JSON.parse(savedMeals)
    const currentDate = getToday()
    return storedMeals.map((meal) => ({
      ...meal,
      date: meal.date ?? currentDate
    }))
  })
  const [editingMealId, setEditingMealId] = useState(null)
  const today = getToday()
  const todayMeals = meals.filter((meal) => meal.date === today)
  const totalCalories = todayMeals.reduce(
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
      calories,
      date: today
    }
    setMeals([...meals, newMeal])
    setCaloriesInput('')
    setFoodName('')
  }
  function handleStartEditing(meal)
  {
    setEditingMealId(meal.id)
    setFoodName(meal.name)
    setCaloriesInput(String(meal.calories))
  }
  function handleCancelEditing()
  {
    setEditingMealId(null)
    setFoodName('')
    setCaloriesInput('')
  }
  function handleSaveMeal()
  {
    const calories = Number(caloriesInput)
    if (!foodName.trim() || calories <= 0) return
    const updatedMeals = meals.map((meal) => {
      if (meal.id !== editingMealId) return meal
      return {
        ...meal,
        name: foodName.trim(),
        calories
      }
    })
    setMeals(updatedMeals)
    handleCancelEditing()
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
      {editingMealId === null ? (
        <button
          type="button"
          onClick={handleAddCalories}
          >
            Add Meal
          </button>
      ) : (
        <>
          <button
            type="button"
            onClick={handleSaveMeal}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancelEditing}
          >
            Cancel
          </button>
        </>
      )}
      <ul>
        {todayMeals.map((meal) => (
          <li key={meal.id}>
            {meal.name} - {meal.calories} kcal
            <button
              type="button"
              onClick={() => handleStartEditing(meal)}
            >
              Edit
            </button>
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
