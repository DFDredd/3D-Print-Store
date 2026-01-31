// Product data with color options for clamshells
const products = [
  {
    id: 1,
    name: "Small Clamshell",
    price: 0.20,
    image: "small-clamshell.jpg",
    colors: ["Ruby Red", "Black", "White", "Neon Green", "Blue"]
  },
  {
    id: 2,
    name: "Small BeanKan",
    price: 0.50,
    image: "small-beankan.jpg",
    colors: ["Black", "White", "Gray", "Red", "Purple"]
  },
  {
    id: 3,
    name: "Poker Chip (Custom Colors)",
    price: 15.00,
    image: "poker-chip.jpg"
    // no colors array = no color selector
  },
  // Add more products here...
];

let cart = {};

// Load cart from localStorage
function loadCart() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
  updateCartCount();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

// Update cart icon count
function updateCartCount() {
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) cartCountEl.textContent = count;
}

// Render products on index.html
function renderProducts() {
  const productList = document.getElementById("product-list");
  if (!productList) return;

  productList.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.className = "product";
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      
      ${product.colors ? `
        <select id="color-${product.id}">
          ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
        </select>
      ` : ''}
      
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

// Add item to cart with selected color (if applicable)
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const colorSelect = document.getElementById(`color-${id}`);
  const selectedColor = colorSelect ? colorSelect.value : null;

  const cartKey = selectedColor ? `${id}-${selectedColor}` : id;

  if (!cart[cartKey]) {
    cart[cartKey] = { ...product, quantity: 0, color: selectedColor };
  }
  cart[cartKey].quantity++;
  saveCart();

  if (document.getElementById("cart-items")) renderCart();
}

// Render cart on cart.html
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;

  for (const key in cart) {
    const item = cart[key];
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <p>
        ${item.quantity} × ${item.name} 
        ${item.color ? `(${item.color})` : ''} 
        @ $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}
      </p>
      <button onclick="removeFromCart('${key}')">Remove</button>
    `;
    cartItems.appendChild(div);
  }

  cartTotal.textContent = `Total: $${total.toFixed(2)}`;

  updateOrderForm(total);
}

// Fill hidden order details field for Web3Forms
function updateOrderForm(total) {
  const orderDetailsField = document.getElementById("order-details");
  const submitBtn = document.getElementById("submit-order-btn");

  if (!orderDetailsField) return;

  if (Object.keys(cart).length === 0) {
    orderDetailsField.value = "";
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  let details = `Order Date: ${new Date().toLocaleString()}\n\n`;

  for (const key in cart) {
    const item = cart[key];
    const itemTotal = item.price * item.quantity;
    details += `• ${item.quantity} × ${item.name} ${item.color ? `(${item.color})` : ''} @ $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}\n`;
  }

  details += `\nTotal: $${total.toFixed(2)}\n\n`;
  details += `Payment preference will be discussed via email. Preferred: CashApp or PayPal (4% fee for PayPal).`;

  orderDetailsField.value = details;

  if (submitBtn) submitBtn.disabled = false;
}

// Remove item from cart
function removeFromCart(key) {
  if (cart[key]) {
    if (cart[key].quantity > 1) {
      cart[key].quantity--;
    } else {
      delete cart[key];
    }
    saveCart();
    renderCart();
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadCart();

  if (document.getElementById("product-list")) {
    renderProducts();
  }

  if (document.getElementById("cart-items")) {
    renderCart();
  }

  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", () => {
      document.getElementById("form-message").innerHTML = "<p style='color:green;'>Order submitted! You'll be redirected shortly.</p>";
    });
  }
});

