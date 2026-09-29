
// =====================================
// SHOP EASY - COMPLETE HOMEPAGE SCRIPT
// =====================================

// PRODUCT DATA
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
        description: "Premium wireless headphones with clear sound and comfortable ear cushions."
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 3999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
        description: "Stylish smartwatch with fitness tracking and smart notifications."
    },
    {
        id: 3,
        name: "Running Shoes",
        category: "Fashion",
        price: 1999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
        description: "Lightweight running shoes for workouts and everyday use."
    },
    {
        id: 4,
        name: "Classic Backpack",
        category: "Accessories",
        price: 1499,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        description: "Durable backpack for college, travel, and daily use."
    },
    {
        id: 5,
        name: "Modern Sunglasses",
        category: "Accessories",
        price: 999,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        description: "Trendy sunglasses with a stylish frame."
    },
    {
        id: 6,
        name: "Bluetooth Speaker",
        category: "Electronics",
        price: 1799,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600",
        description: "Portable Bluetooth speaker with powerful audio."
    },
    {
        id: 7,
        name: "Casual T-Shirt",
        category: "Fashion",
        price: 799,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        description: "Comfortable casual T-shirt for everyday wear."
    },
    {
        id: 8,
        name: "Digital Camera",
        category: "Electronics",
        price: 12999,
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
        description: "Compact digital camera to capture memorable moments."
    }
];

// =====================================
// SELECT ELEMENTS
// =====================================

const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const noProducts = document.getElementById("no-products");

const categoryButtons = document.querySelectorAll(".category-btn");

const modal = document.getElementById("product-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");

const modalAddCart = document.getElementById("modal-add-cart");
const closeModal = document.getElementById("close-modal");

let selectedProduct = null;
let activeCategory = "All";

// =====================================
// FORMAT PRICE
// =====================================

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// =====================================
// GET CART
// =====================================

function getCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem("shopEasyCart") || "[]"
        );

        return Array.isArray(cart) ? cart : [];

    } catch (error) {
        console.error("Cart loading error:", error);
        return [];
    }
}

// =====================================
// SAVE CART
// =====================================

function saveCart(cart) {
    try {
        localStorage.setItem(
            "shopEasyCart",
            JSON.stringify(cart)
        );

        return true;

    } catch (error) {
        console.error("Cart saving error:", error);

        alert("Unable to save cart. Please check browser storage.");
        return false;
    }
}

// =====================================
// UPDATE CART COUNT
// =====================================

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");

    if (!cartCount) return;

    const cart = getCart();

    const totalItems = cart.reduce((total, item) => {
        return total + Number(item.quantity || 0);
    }, 0);

    cartCount.textContent = `Cart (${totalItems})`;
}

// =====================================
// ADD TO CART
// =====================================

function addToCart(product) {

    if (!product) {
        alert("Product not found!");
        return;
    }

    const cart = getCart();

    const existingItem = cart.find(
        item => Number(item.id) === Number(product.id)
    );

    if (existingItem) {

        existingItem.quantity =
            Number(existingItem.quantity || 0) + 1;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });

    }

    const saved = saveCart(cart);

    if (saved) {
        updateCartCount();

        alert(product.name + " added to cart!");
    }
}

// =====================================
// PRODUCT CARD BUTTONS
// Works with HTML-written product cards
// =====================================

productGrid.addEventListener("click", function(event) {

    const button = event.target.closest("button");

    if (!button) return;

    const productId = Number(button.dataset.id);

    const product = products.find(
        item => item.id === productId
    );

    if (!product) {
        alert("Product ID not found: " + productId);
        return;
    }

    // ADD TO CART BUTTON
    if (button.classList.contains("add-cart-btn")) {
        addToCart(product);
    }

    // VIEW DETAILS BUTTON
    if (button.classList.contains("view-btn")) {
        selectedProduct = product;

        modalImage.src = product.image;
        modalImage.alt = product.name;

        modalTitle.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = formatPrice(product.price);

        modal.classList.add("show");
    }

});

// =====================================
// MODAL ADD TO CART
// =====================================

modalAddCart.addEventListener("click", function() {

    if (selectedProduct) {
        addToCart(selectedProduct);

        modal.classList.remove("show");

        selectedProduct = null;
    }

});

// =====================================
// CLOSE MODAL
// =====================================

closeModal.addEventListener("click", function() {
    modal.classList.remove("show");
});

modal.addEventListener("click", function(event) {

    if (event.target === modal) {
        modal.classList.remove("show");
    }

});

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {
        modal.classList.remove("show");
    }

});

// =====================================
// SEARCH AND CATEGORY FILTER
// =====================================

function filterProducts() {

    const searchTerm = searchInput.value.toLowerCase().trim();

    const cards = productGrid.querySelectorAll(".product-card");

    let visibleCount = 0;

    cards.forEach(card => {

        const name = card.querySelector("h3")
            .textContent.toLowerCase();

        const category = card.querySelector(".product-category")
            .textContent.trim();

        const matchesSearch =
            name.includes(searchTerm) ||
            category.toLowerCase().includes(searchTerm);

        const matchesCategory =
            activeCategory === "All" ||
            category === activeCategory;

        if (matchesSearch && matchesCategory) {
            card.style.display = "flex";
            visibleCount++;
        } else {
            card.style.display = "none";
        }

    });

    noProducts.style.display =
        visibleCount === 0 ? "block" : "none";
}

searchInput.addEventListener("input", filterProducts);

categoryButtons.forEach(button => {

    button.addEventListener("click", function() {

        categoryButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        activeCategory = button.dataset.category;

        filterProducts();

    });

});

// =====================================
// INITIALIZE
// =====================================

updateCartCount();
filterProducts();

console.log("ShopEasy JavaScript loaded successfully!");