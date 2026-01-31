// Product data with color options for clamshells
const products = [
  {
    id: 1,
    name: "Small Clamshell",
    price: 0.20,
    image: "small-clamshell.jpg",
    colors: ["Black", "Blue", "Red"],
    description: "Small clamshells for seed storage/shipping"
  },
  {
    id: 2,
    name: "Small BeanKan",
    price: 25.0,
    image: "small-beankan.jpg",
    description: "Small BeanKan has two layers and is used to germinate seeds without drowning them"
  },
  {
    id: 3,
    name: "Poker Chip",
    price: 0.25,
    image: "poker-chip.jpg",
    colors: ["Black", "Blue", "Red", "Silver"],
    description: "Poker chips can be customizable with a simple logo or text for an additional fee"
  }
  // Add more products here as needed
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

// Render products on index.html with description
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
      <p class="price">$${product.price.toFixed(2)}</p>
      
      <p class="description">${product.description || 'No description available.'}</p>
      
      ${product.colors ? `
        <label for="color-${product.id}">Color:</label>
        <select id="color-${product.id}">
          ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('')}
        </select>
      ` : ''}
      
      <label for="qty-${product.id}">Quantity:</label>
      <input type="number" id="qty-${product.id}" min="1" value="1" step="1" style="width:60px; margin:0 0.5rem;" />
      
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productList.appendChild(div);
  });
}

// Add item to cart with selected color & quantity
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const colorSelect = document.getElementById(`color-${id}`);
  const qtyInput = document.getElementById(`qty-${id}`);
  
  const selectedColor = colorSelect ? colorSelect.value : null;
  const quantity = parseInt(qtyInput.value) || 1;
  if (quantity < 1) return; // prevent invalid qty

  const cartKey = selectedColor ? `${id}-${selectedColor}` : id.toString();

  if (!cart[cartKey]) {
    cart[cartKey] = { ...product, quantity: 0, color: selectedColor };
  }
  cart[cartKey].quantity += quantity;
  
  saveCart();

  // Optional: reset quantity input after add
  qtyInput.value = "1";

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
    form.addEventListener("submit", (e) => {
      // Web3Forms handles the actual send + redirect
      // We clear cart after submit (assuming success – real check would need AJAX)
      setTimeout(() => {
        cart = {};
        saveCart();
        renderCart();
        document.getElementById("form-message").innerHTML = "<p style='color:green;'>Order submitted! Cart cleared. Redirecting...</p>";
      }, 500); // small delay to allow form submit
    });
  }
});













