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
  const [foodImage, setFoodImage] = useState(null)
  const [foodImagePreview, setFoodImagePreview] = useState('')
  const [backendStatus, setBackendStatus] = useState('checking')
  const today = getToday()
  const todayMeals = meals.filter((meal) => meal.date === today)
  const totalCalories = todayMeals.reduce(
    (total, meal) => total + meal.calories,
    0
  )
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisDraft, setAnalysisDraft] = useState(null)
  const [analysisError, setAnalysisError] = useState('')
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals))
  }, [meals])
  useEffect(() => {
    return () => {
      if (foodImagePreview) {
        URL.revokeObjectURL(foodImagePreview)
      }
    }
  }, [foodImagePreview])
  useEffect(() => {
    fetch('http://localhost:3001/api/health')
      .then((response) => {
        if(!response.ok) {
          throw new Error('Backend kaput request failed')
        }
        return response.json()
      })
      .then((data) => {
        setBackendStatus(data.status)
      })
      .catch(() => {
        setBackendStatus('went for bread, be soon')
      })
  }, [])
  function handleAddCalories()
  {
    const calories = Number(caloriesInput)
    if (!foodName.trim() || calories <= 0) return
    const newMeal = 
    {
      id: Date.now(),
      name: foodName.trim(),
      calories,
      ingredients: analysisDraft?.ingredients ?? [],
      confidence: analysisDraft?.confidence ?? null,
      assumptions: analysisDraft?.assumptions ?? [],
      date: today
    }
    setMeals([...meals, newMeal])
    setCaloriesInput('')
    setFoodName('')
    setAnalysisDraft(null)
    setAnalysisError('')
    setFoodImage(null)
    setFoodImagePreview('')
  }
  function handleStartEditing(meal)
  {
    setEditingMealId(meal.id)
    setFoodName(meal.name)
    setCaloriesInput(String(meal.calories))
    setAnalysisDraft({
      foodName: meal.name,
      ingredients: meal.ingredients ?? [],
      totalCalories: meal.calories,
      confidence: meal.confidence ?? 'medium',
      assumptions: meal.assumptions ?? []
    })
    setFoodImage(null)
    setFoodImagePreview('')
  }
  function handleCancelEditing()
  {
    setEditingMealId(null)
    setFoodName('')
    setCaloriesInput('')
    setFoodImage(null)
    setFoodImagePreview('')
    setAnalysisDraft(null)
    setAnalysisError('')
  }
  function handleImageChange(event)
  {
    const file = event.target.files?.[0]
    if (!file) return
    setFoodImage(file)
    const previewURL = URL.createObjectURL(file)
    setFoodImagePreview(previewURL)
  }
  async function handleAnalyzeFood() 
  {
    if (!foodImage) return
    setIsAnalyzing(true)
    setAnalysisDraft(null)
    setAnalysisError('')
    try {
      const formData = new FormData()
      formData.append('image', foodImage)
      if(analysisDraft) {
        formData.append('ingredients', JSON.stringify(analysisDraft.ingredients))
      }
      const response = await fetch ('http://localhost:3001/api/analyze-food', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if(!response.ok) {
        throw new Error(data.error || 'Could not analyze image.')
      }
      const parsedResult = JSON.parse(data.result)
      setAnalysisDraft(parsedResult)
      setFoodName(parsedResult.foodName)
      setCaloriesInput(String(parsedResult.totalCalories))
    } catch (error) {
      setAnalysisError(error.message)
    } finally {
      setIsAnalyzing(false)
    }
  }
  function handleIngredientChange(index, field, value) {
    setAnalysisDraft ((draft) => {
      if (!draft) return draft
      const updatedIngredients = draft.ingredients.map(
        (ingredient, ingredientIndex) => {
          if (ingredientIndex !== index) return ingredient
          return {
            ...ingredient,
            [field]: value
          }
        }
      )
      const totalCalories = updatedIngredients.reduce(
        (total, ingredient) => total + Number(ingredient.calories || 0),
        0
      )
      setCaloriesInput(String(totalCalories))
      return {
        ...draft,
        ingredients: updatedIngredients,
        totalCalories
      }
    })
  }
  function handleRemoveIngredient(index) {
    setAnalysisDraft((draft) => {
      if (!draft) return draft
      const updatedIngredients = draft.ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index
      )
      const totalCalories = updatedIngredients.reduce(
        (total, ingredient) => total + Number(ingredient.calories || 0),
        0
      )
      return {
        ...draft,
        ingredients: updatedIngredients,
        totalCalories
      }
    })
  }
  function handleAddIngredient() {
    setAnalysisDraft((draft) => {
      if (!draft) return draft
      return {
        ...draft,
        ingredients: [
          ...draft.ingredients,
          {
            name: '',
            amount: '',
            calories: ''
          }
        ]
      }
    })
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
        calories,
        ingredients: analysisDraft?.ingredients ?? meal.ingredients ?? [],
        confidence: analysisDraft?.confidence ?? meal.confidence ?? null,
        assumptions: analysisDraft?.assumptions ?? meal.assumptions ?? []
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
        Backend status: {backendStatus}
      </p>
      <p>
        Calories consumed today: {totalCalories} kcal
      </p>
      <label>
        Food photo:
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageChange}
        >
        </input>
        {foodImage && (
          <p>
            Selected file: {foodImage.name}
          </p>
        )}
        {foodImagePreview && (
          <img
            src={foodImagePreview}
            alt="Selected food"
            width="240"
          />
          )}
          <button
            type="button"
            onClick={handleAnalyzeFood}
            disabled={!foodImage || isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : analysisDraft ? 'Re-analyze' : 'Analyze Food'}
          </button>
          {analysisError && <p>{analysisError}</p>}
          {analysisDraft && (
            <section>
              <h2>Analysis Draft</h2>
              <p>Confidence: {analysisDraft.confidence}</p>
              <h3>Ingredients</h3>
              {analysisDraft.ingredients.map((ingredient,index) => (
                <div key={index}>
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(event) =>
                      handleIngredientChange(index, 'name', event.target.value)
                    }
                    placeholder="Ingredient"
                    />
                    <input
                      type="text"
                      value={ingredient.amount}
                      onChange={(event) =>
                        handleIngredientChange(index, 'amount', event.target.value)
                      }
                      placeholder="Amount"
                    />
                    <input
                      type="number"
                      value={ingredient.calories}
                      onChange={(event) =>
                        handleIngredientChange(index, 'calories', event.target.value)
                      }
                      placeholder="Calories"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(index)}
                    >
                      Remove
                      </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddIngredient}
              >
                Add Ingredient
              </button>
              <p>
                Estimated total: {analysisDraft.totalCalories} kcal
              </p>
            </section>
          )}
      </label>
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
