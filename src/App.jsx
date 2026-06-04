import ShoppingCard from './assets/img/shopping-card.png'
import EmptyBasket from './assets/img/empty-basket.png'
import { useEffect, useState } from 'react'
import './App.css'

// Api Uzerinden Gelen Data'lar Arasinda Price Olmadigi Icin
// Price Data'sini Kendimiz Uretiyoruz
const generatePrice = (id) => {
  const base = (id * 7 + 13) % 25;
  return Number((base + 5 + 0.99).toFixed(2));
};

function OrderConfirmedModal({ cart, totalItems, onClose }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-icon">✔</div>
        <h2 className="modal-title">Order Confirmed</h2>
        <p className="modal-subtitle">We hope it made your day!</p>
        <div className="modal-items">
          {cart.map((item) => (
            <div key={item.id} className="modal-item">
              <img src={item.image} alt={item.name} className='modal-item-img' />
              <div className="modal-item-info">
                <p className="modal-item-name">{item.name}</p>
                <span className="modal-item-quantity">{item.quantity}x</span>
                <span className="modal-item-unit-price">@ ${item.price.toFixed(2)}</span>
              </div>
              <span className="modal-item-total">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="modal-total">
            <span>Order Total</span>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
        </div>
        <button className='modal-btn' onClick={onClose}>Start New Order</button>
      </div>
    </div>
  )
}

export default function App() {

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();
  const [recipes, setRecipes] = useState([]);
  const [cart, setCart] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showThankyou, setShowThankyou] = useState(false);

  // fetch Islemini Yonetmek Icin 
  // useEffect Icinden Cikarip 
  // Fonksiyon Haline Getiriyoruz
  const fetchRecipes = () => {
    setLoading(true);
    setError(null);

    fetch('https://dummyjson.com/recipes')
      .then(response => response.json())
      .then((data) => {
        const recipesWithPrice = data.recipes.map((recipe) => ({
          ...recipe,
          price: generatePrice(recipe.id)
        }))
        setRecipes(recipesWithPrice)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error);
        setLoading(false)
        setError(true)
      });
    // .then(console.log);
  }

  useEffect(() => {
    fetchRecipes();
  }, [])

  // Sepete Urun Ekleme
  const addToCart = (recipe) => {
    setCart((prev) => {

      // Eklenmek Istenilen Item Sepette Var Mi Kontrolu Yapiyoruz
      const existing = prev.find((item) => item.id === recipe.id);
      if (existing) {

        // Eklenmek Istenilen Urun Sepette Varsa Sepetteki urun Adedini Artiriyoruz
        return prev.map((item) =>
          item.id === recipe.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      // Eklenmek Istenilen Urun Sepette Yoksa Sepete Ekliyoruz
      return [...prev, { ...recipe, quantity: 1 }];
    })
  }

  // Urun Sayisi Artirma
  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    )
  }

  // Urun Sayisi Azaltma
  const decreaseQuantity = (id) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === id)

      if (existing.quantity === 1) {
        return prev.filter((item) => item.id !== id)
      }
      return prev.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item
      )
    })
  }

  // Sepetten Urun Silme
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  // Sepetteki Toplam Urun Sayisi
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleConfirmOrder = () => {
    setShowModal(false);
    setCart([]);
    setShowThankyou(true);
  }

  const handleNewOrder=()=>{
    setShowThankyou(false);
    fetchRecipes()
  }

  if (loading) {
    return (
      <div className="status-screen">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="status-screen">
        <p className="error-icon">⚠️</p>
        <p className="error-message">Created An Error:{error}</p>
        <button
          className='retry-button'
          onClick={fetchRecipes}
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <>
      {showModal && (
        <OrderConfirmedModal
          cart={cart}
          totalItems={totalItems}
          onClose={handleConfirmOrder}
        />
      )}

      {showThankyou && (
        <div className="thankyou-overlay">
          <div className="thankyou-card">
            <div className="thankyou-icon">✔</div>
            <h2 className="thankyou-title">Thank You!</h2>
            <p className="thankyou-subtitle">Your order has been received. Enjoy your meal! 🍽️</p>
            <button 
              className='thankyou-button'
              onClick={handleNewOrder}
            >
              Please A New Order
            </button>
          </div>
        </div>
      )}
      <div className="container">
        <div className="general-title">
          <h1>Meals</h1>
        </div>
        <div className="food-card-and-order-card">
          <div className="food-card">
            {recipes.map((recipe) => {

              // Urun Sepette Var Mi Kontrolu Yapiyoruz
              const cartItem = cart.find((item) => item.id === recipe.id)

              return (
                <div key={recipe.id} className='product-informations'>
                  <div className="image-wrapper">
                    <img
                      src={recipe.image}
                      className={`product-photo ${cartItem ? 'product-photo-active' : ''}`}
                      alt={recipe.name} />

                    {/* Urun Sepette Yoksa Ekliyoruz
                        Urun Sepette Varsa Adet Artiriyoruz */}
                    {!cartItem ? (
                      <button className='add-to-cart-button' onClick={() => addToCart(recipe)}>
                        <img src={ShoppingCard} alt="Shopping Card" />
                        Add to Cart
                      </button>
                    ) : (
                      <div className="quantity-controls">
                        <button
                          className='cart-quantity-button'
                          onClick={() => decreaseQuantity(recipe.id)}
                        >
                          -
                        </button>
                        <span className="quantity-count">{cartItem.quantity}</span>
                        <button
                          className='cart-quantity-button'
                          onClick={() => increaseQuantity(recipe.id)}
                        >
                          +
                        </button>
                      </div>
                    )}

                  </div>
                  <h5>{recipe.cuisine}</h5>
                  <h4>{recipe.name}</h4>
                  <h4>${recipe.price}</h4>
                </div>
              )
            })}
          </div>
          <div className="order-card">
            <h2>Your Cart ({totalItems})</h2>

            {/* Kosullu Guncelleme */}
            {cart.length === 0 ? (
              <div className="items-card">
                <img src={EmptyBasket} alt="Empty Basket" />
                <h5>Your added items will appear here</h5>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <p className='cart-item-name'>{item.name}</p>

                        <div className="cart-item-bottom">
                          <div className="cart-quantity-controls">
                            <span className='quantity-count'>{item.quantity}x</span>
                          </div>
                          <span className='cart-item-price'>@ ${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        className='remove-button'
                        onClick={() => removeFromCart(item.id)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>

                {/* Toplam Fiyat ve Onaylama */}
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Order Total</span>
                    <strong>${totalPrice.toFixed(2)}</strong>
                  </div>
                  <button
                    className="confirm-btn"
                    onClick={() => setShowModal(true)}
                  >
                    Confirm Order
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}