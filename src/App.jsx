import { useState } from 'react'
import './App.css'
function App() 
{
  const [totalCalories, setTotalCalories] = useState(0)
  const [caloriesInput, setCaloriesInput] = useState('')
  function handleAddCalories()
  {
    const calories = Number(caloriesInput)
    if (calories <= 0) return
    setTotalCalories(totalCalories + calories)
    setCaloriesInput('')
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
        Add Calories
      </button>
    </main>
  )
}
export default App