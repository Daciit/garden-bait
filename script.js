/*
 * Common cart functionality across pages. The cart is persisted
 * in localStorage so items remain in the cart when navigating
 * between pages. Each product can be added to the cart with
 * addToCart(). The cart count in the navigation is updated
 * automatically on page load and whenever items are added or
 * removed. On the cart and checkout pages the cart contents
 * are rendered dynamically.
 */

// Initialise cart from localStorage or an empty array
let cart = [];

function loadCartFromStorage() {
  try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
  } catch (e) {
    cart = [];
  }
}

// Persist the current cart to localStorage
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart count displayed in the navigation
function updateCartCount() {
  const countSpan = document.getElementById('cart-count');
  if (countSpan) {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    countSpan.textContent = totalItems;
  }
}

// Add a product to the cart. If it already exists its quantity is
// incremented. Product ID should be a unique string.
function addToCart(id, name, price, cost) {
  // Ensure numbers are numbers
  const priceNum = parseFloat(price);
  const costNum = parseFloat(cost);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price: priceNum, cost: costNum, qty: 1 });
  }
  saveCart();
  updateCartCount();
  alert(`${name} added to cart`);
}

// Remove a product completely from the cart
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartCount();
  // Refresh lists if on cart/checkout pages
  displayCartItems();
  displayCheckoutItems();
}

// Render the cart items on the cart page
function displayCartItems() {
  const container = document.getElementById('cart-items');
  const totalElem = document.getElementById('cart-total');
  if (!container || !totalElem) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <span>${item.name} (x${item.qty})</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
      <button onclick="removeFromCart('${item.id}')">Remove</button>
    `;
    container.appendChild(row);
    total += item.price * item.qty;
  });
  totalElem.textContent = `$${total.toFixed(2)}`;
}

// Render the cart items on the checkout page
function displayCheckoutItems() {
  const container = document.getElementById('checkout-items');
  const totalElem = document.getElementById('checkout-total');
  if (!container || !totalElem) return;
  container.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'checkout-row';
    row.innerHTML = `
      <span>${item.name} (x${item.qty})</span>
      <span>$${(item.price * item.qty).toFixed(2)}</span>
    `;
    container.appendChild(row);
    total += item.price * item.qty;
  });
  totalElem.textContent = `$${total.toFixed(2)}`;
}

// Load cart from storage and update count on every page load
document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  updateCartCount();
  // If on cart or checkout page, render the lists
  displayCartItems();
  displayCheckoutItems();
});