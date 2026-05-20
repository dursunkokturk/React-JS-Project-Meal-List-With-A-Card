import { useEffect, useState } from 'react'
import './App.css'

export default function App() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/recipes')
      .then(response => response.json())
      .then((data) => {
        setRecipes(data.recipes);
      })
    // .then(console.log);
  }, [])

  return (
    <>
      <div className="general-title">
        <h1>Yemekler</h1>
      </div>
      <div className="food-card">
        {recipes.map((recipe) => (
          <div key={recipe.id} className='product-informations'>
            <img src={recipe.image} alt="" />
            <h5>{recipe.cuisine}</h5>
            <h4>{recipe.name}</h4>
          </div>
        ))}
      </div>
    </>
  )
}