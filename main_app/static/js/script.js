// Global Variables
let currentUser = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Sample Products Data (Backend Compatible)
const sampleProducts = [
    {
        id: 1,
        name: "Fender Stratocaster Electric Guitar",
        category: "guitar",
        price: 899.99,
        image: "🎸",
        description: "Classic electric guitar with versatile sound"
    },
    {
        id: 2,
        name: "Yamaha Acoustic Guitar",
        category: "guitar",
        price: 299.99,
        image: "🎸",
        description: "High-quality acoustic guitar for beginners"
    },
    {
        id: 3,
        name: "Pearl Export Drum Set",
        category: "drums",
        price: 1299.99,
        image: "🥁",
        description: "Professional 5-piece drum set"
    },
    {
        id: 4,
        name: "Roland Digital Piano",
        category: "piano",
        price: 1599.99,
        image: "🎹",
        description: "88-key digital piano with weighted keys"
    },
    {
        id: 5,
        name: "Yamaha Violin",
        category: "strings",
        price: 599.99,
        image: "🎻",
        description: "Professional violin for intermediate players"
    },
    {
        id: 6,
        name: "Fender Jazz Bass",
        category: "bass",
        price: 799.99,
        image: "🎸",
        description: "4-string bass guitar with smooth action"
    },
    {
        id: 7,
        name: "Marshall Guitar Amplifier",
        category: "amplifier",
        price: 499.99,
        image: "🔊",
        description: "50W tube amplifier with classic tone"
    },
    {
        id: 8,
        name: "Gibson Les Paul",
        category: "guitar",
        price: 2499.99,
        image: "🎸",
        description: "Premium electric guitar with humbucker pickups"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Load products
    products = sampleProducts;
    displayProducts(products);
    
    // Initialize event listeners
    setupEventListeners();
    
    // Update cart display
    updateCartDisplay();
    
    // Check if user is logged in
    checkUserSession();
}

function setupEventListeners() {
    // Modal functionality
    const loginBtn = document.getElementById('loginBtn');
    const modal = document.getElementById('authModal');
    const closeBtn = document.querySelector('.close');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartLink = document.querySelector('.cart-link');
    const cartSidebar = document.getElementById('cartSidebar');
    
    // Login button
    loginBtn.addEventListener('click', () => {
        modal.style.display = 'block';
    });
    
    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            switchTab(tab);
        });
    });
    
    // Form submissions
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Category filtering
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.category;
            filterByCategory(category);
        });
    });
    
    // Cart functionality
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        cartSidebar.classList.add('open');
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    // Close cart when clicking outside
    window.addEventListener('click', (e) => {
        if (!cartSidebar.contains(e.target) && !cartLink.contains(e.target)) {
            cartSidebar.classList.remove('open');
        }
    });
}

// Authentication Functions
function switchTab(tab) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    
    // Update forms
    document.querySelectorAll('.auth-form').forEach(form => {
        form.classList.remove('active');
    });
    document.getElementById(`${tab}Form`).classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual backend call)
        const response = await simulateApiCall('/api/login', {
            email,
            password
        });
        
        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            document.getElementById('authModal').style.display = 'none';
            showNotification('Login successful!', 'success');
        } else {
            showNotification(response.message || 'Login failed', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const userType = document.getElementById('userType').value;
    
    // Show loading state
    const submitBtn = e.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.innerHTML = '<span class="loading"></span> Creating account...';
    submitBtn.disabled = true;
    
    try {
        // Simulate API call (replace with actual backend call)
        const response = await simulateApiCall('/api/register', {
            name,
            email,
            password,
            userType
        });
        
        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateUserInterface();
            document.getElementById('authModal').style.display = 'none';
            showNotification('Account created successfully!', 'success');
        } else {
            showNotification(response.message || 'Registration failed', 'error');
        }
    } catch (error) {
        showNotification('Network error. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function checkUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = handleLogout;
    } else {
        loginBtn.innerHTML = 'Login';
        loginBtn.onclick = () => document.getElementById('authModal').style.display = 'block';
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showNotification('Logged out successfully', 'success');
}

// Product Display Functions
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card fade-in';
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
            Add to Cart
        </button>
    `;
    return card;
}

// Search and Filter Functions
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    displayProducts(filteredProducts);
}

function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
    
    // Update active category
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.borderColor = '#333';
    });
    document.querySelector(`[data-category="${category}"]`).style.borderColor = '#ff6b35';
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`, 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
    saveCartToStorage();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCartDisplay();
        saveCartToStorage();
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.getElementById('cartTotal');
    
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #888; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Utility Functions
function scrollToCategories() {
    document.getElementById('categories').scrollIntoView({
        behavior: 'smooth'
    });
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#ff6b35'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .notification-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: 1rem;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Backend API Simulation (Replace with actual API calls)
async function simulateApiCall(endpoint, data) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate different responses based on endpoint
    if (endpoint === '/api/login') {
        // Simulate successful login for demo@example.com / password123
        if (data.email === 'demo@example.com' && data.password === 'password123') {
            return {
                success: true,
                user: {
                    id: 1,
                    name: 'Demo User',
                    email: data.email,
                    type: 'user'
                }
            };
        } else {
            return {
                success: false,
                message: 'Invalid email or password'
            };
        }
    } else if (endpoint === '/api/register') {
        // Simulate successful registration
        return {
            success: true,
            user: {
                id: Date.now(),
                name: data.name,
                email: data.email,
                type: data.userType
            }
        };
    }
    
    return { success: false, message: 'Unknown endpoint' };
}

// Backend Integration Functions (Ready for real API)
async function apiCall(endpoint, method = 'GET', data = null) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    // Add authentication token if user is logged in
    if (currentUser && currentUser.token) {
        config.headers.Authorization = `Bearer ${currentUser.token}`;
    }
    
    try {
        const response = await fetch(`/api${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Product Management (for admin users)
async function loadProducts() {
    try {
        const response = await apiCall('/products');
        products = response.products;
        displayProducts(products);
    } catch (error) {
        console.error('Failed to load products:', error);
        // Fallback to sample products
        products = sampleProducts;
        displayProducts(products);
    }
}

async function addProduct(productData) {
    if (!currentUser || currentUser.type !== 'admin') {
        showNotification('Admin access required', 'error');
        return;
    }
    
    try {
        const response = await apiCall('/products', 'POST', productData);
        products.push(response.product);
        displayProducts(products);
        showNotification('Product added successfully', 'success');
    } catch (error) {
        showNotification('Failed to add product', 'error');
    }
}

// Order Management
async function createOrder() {
    if (cart.length === 0) {
        showNotification('Cart is empty', 'error');
        return;
    }
    
    if (!currentUser) {
        showNotification('Please login to checkout', 'error');
        return;
    }
    
    try {
        const orderData = {
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            userId: currentUser.id
        };
        
        const response = await apiCall('/orders', 'POST', orderData);
        
        // Clear cart after successful order
        cart = [];
        updateCartDisplay();
        saveCartToStorage();
        
        showNotification('Order placed successfully!', 'success');
        return response.order;
    } catch (error) {
        showNotification('Failed to place order', 'error');
    }
}

// Initialize products on load
document.addEventListener('DOMContentLoaded', function() {
    // Try to load products from API, fallback to sample data
    loadProducts().catch(() => {
        products = sampleProducts;
        displayProducts(products);
    });
});

// Make functions globally available
window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;
window.scrollToCategories = scrollToCategories;
