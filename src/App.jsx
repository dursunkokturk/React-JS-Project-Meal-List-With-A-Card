import ShoppingCard from './assets/img/shopping-card.png'
import EmptyBasket from './assets/img/empty-basket.png'
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
      <div className="container">
        <div className="general-title">
          <h1>Meals</h1>
        </div>
        <div className="food-card">
          {recipes.map((recipe) => (
            <div key={recipe.id} className='product-informations'>
              <button>
                <img src={ShoppingCard} alt="" />
                Add to Cart
              </button>
              <img src={recipe.image} alt="" />
              <h5>{recipe.cuisine}</h5>
              <h4>{recipe.name}</h4>
            </div>
          ))}
        </div>
        <div className="order-card">
          <h2>Your Cart (0)</h2>
          <img src={EmptyBasket} alt="" />
        </div>
      </div>
    </>
  )
}