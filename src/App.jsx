import ShoppingCard from './assets/img/shopping-card.png'
import EmptyBasket from './assets/img/empty-basket.png'
import { useEffect, useState } from 'react'
import './App.css'

// Api Uzerinden Gelen Data'lar Arasinda Price Olmadigi Icin
// Price Data'sini Kendimiz Uretiyoruz
const generatePrice = (id) => {
  const base = (id * 7 + 13) % 25;
  return (base + 5 + 0.99).toFixed(2);
};

export default function App() {

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch('https://dummyjson.com/recipes')
      .then(response => response.json())
      .then((data) => {
        const recipesWithPrice = data.recipes.map((recipe) => ({
          ...recipe,
          price: generatePrice(recipe.id)
        }))
        setRecipes(recipesWithPrice)
      })
    // .then(console.log);
  }, [])

  return (
    <>
      <div className="container">
        <div className="general-title">
          <h1>Meals</h1>
        </div>
        <div className="food-card-and-order-card">
          <div className="food-card">
            {recipes.map((recipe) => (
              <div key={recipe.id} className='product-informations'>
                <div className="image-wrapper">
                  <img src={recipe.image} className='product-photo' alt="" />
                  <button>
                    <img src={ShoppingCard} alt="" />
                    Add to Cart
                  </button>
                </div>
                <h5>{recipe.cuisine}</h5>
                <h4>{recipe.name}</h4>
                <h4>${recipe.price}</h4>
              </div>
            ))}
          </div>
          <div className="order-card">
            <h2>Your Cart (0)</h2>
            <div className="items-card">
              <img src={EmptyBasket} alt="" />
              <h5>Your added items will appear here</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}