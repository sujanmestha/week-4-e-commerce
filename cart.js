
// =========================
// GET CART ELEMENTS
// =========================

const cartItemsContainer = document.getElementById("cart-items");
const emptyCart = document.getElementById("empty-cart");

const subtotalElement = document.getElementById("cart-subtotal");
const shippingElement = document.getElementById("shipping-cost");
const totalElement = document.getElementById("cart-total");

const clearCartBtn = document.getElementById("clear-cart-btn");
const checkoutBtn = document.getElementById("checkout-btn");

// =========================
// GET CART FROM LOCAL STORAGE
// =========================

function getCart() {
    try {
        return JSON.parse(localStorage.getItem("shopEasyCart")) || [];
    } catch (error) {
        return [];
    }
}

// =========================
// SAVE CART
// =========================

function saveCart(cart) {
    localStorage.setItem("shopEasyCart", JSON.stringify(cart));
}

// =========================
// FORMAT PRICE
// =========================

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// =========================
// DISPLAY CART ITEMS
// =========================

function displayCart() {
    const cart = getCart();

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        emptyCart.style.display = "block";
        cartItemsContainer.style.display = "none";

        checkoutBtn.disabled = true;
        clearCartBtn.disabled = true;

        checkoutBtn.style.opacity = "0.5";
        clearCartBtn.style.opacity = "0.5";

        updateSummary([]);
        return;
    }

    emptyCart.style.display = "none";
    cartItemsContainer.style.display = "flex";

    checkoutBtn.disabled = false;
    clearCartBtn.disabled = false;

    checkoutBtn.style.opacity = "1";
    clearCartBtn.style.opacity = "1";

    cart.forEach(item => {
        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <img
                src="${item.image}"
                alt="${item.name}"
            >

            <div class="cart-item-info">
                <h3>${item.name}</h3>

                <p class="cart-item-price">
                    ${formatPrice(item.price)}
                </p>

                <div class="quantity-controls">
                    <button
                        class="quantity-btn"
                        data-id="${item.id}"
                        data-action="decrease"
                        aria-label="Decrease quantity"
                    >
                        -
                    </button>

                    <span>${item.quantity}</span>

                    <button
                        class="quantity-btn"
                        data-id="${item.id}"
                        data-action="increase"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>
            </div>

            <button
                class="remove-btn"
                data-id="${item.id}"
            >
                Remove
            </button>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    updateSummary(cart);
}

// =========================
// UPDATE ORDER SUMMARY
// =========================

function updateSummary(cart) {
    const subtotal = cart.reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    const shipping = 0;

    const total = subtotal + shipping;

    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = formatPrice(shipping);
    totalElement.textContent = formatPrice(total);
}

// =========================
// UPDATE PRODUCT QUANTITY
// =========================

function updateQuantity(productId, action) {
    let cart = getCart();

    const item = cart.find(
        product => product.id === productId
    );

    if (!item) return;

    if (action === "increase") {
        item.quantity += 1;
    }

    if (action === "decrease") {
        item.quantity -= 1;
    }

    // Remove item if quantity becomes zero
    cart = cart.filter(item => item.quantity > 0);

    saveCart(cart);

    displayCart();
}

// =========================
// REMOVE PRODUCT
// =========================

function removeItem(productId) {
    let cart = getCart();

    cart = cart.filter(
        item => item.id !== productId
    );

    saveCart(cart);

    displayCart();
}

// =========================
// CART BUTTON EVENTS
// =========================

cartItemsContainer.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    if (button.classList.contains("quantity-btn")) {
        const action = button.dataset.action;

        updateQuantity(productId, action);
    }

    if (button.classList.contains("remove-btn")) {
        removeItem(productId);
    }
});

// =========================
// CLEAR ENTIRE CART
// =========================

clearCartBtn.addEventListener("click", () => {
    const confirmClear = confirm(
        "Are you sure you want to clear your cart?"
    );

    if (confirmClear) {
        localStorage.removeItem("shopEasyCart");

        displayCart();
    }
});

// =========================
// CHECKOUT BUTTON
// =========================

checkoutBtn.addEventListener("click", () => {
    const cart = getCart();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert(
        "Thank you for shopping with ShopEasy! " +
        "Checkout functionality can be added in the next version."
    );
});

// =========================
// INITIALIZE CART PAGE
// =========================

displayCart();