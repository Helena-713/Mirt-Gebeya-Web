const products = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        price: 15,
        category: "vegetables",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400",
        description: "Organic tomatoes from Oromia region"
    },
    {
        id: 2,
        name: "Potatoes",
        price: 25,
        category: "vegetables",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400",
        description: "Fresh potatoes from local farms"
    },
    {
        id: 3,
        name: "Bananas",
        price: 40,
        category: "fruits",
        unit: "per dozen",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400",
        description: "Ripe bananas from southern regions"
    },
    {
        id: 4,
        name: "Avocado",
        price: 20,
        category: "fruits",
        unit: "per piece",
        image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400",
        description: "Fresh Hass avocados"
    },
    {
        id: 6,
        name: "Red Onions",
        price: 30,
        category: "vegetables",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?auto=format&fit=crop&w=400",
        description: "Fresh red onions"
    },
    {
        id: 7,
        name: "Mangoes",
        price: 35,
        category: "fruits",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400",
        description: "Seasonal mangoes from Tigray"
    },
    {
        id: 8,
        name: "Coffee Beans",
        price: 200,
        category: "herbs",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400",
        description: "Premium Ethiopian coffee beans"
    },
    {
        id: 9,
        name: "Spices",
        price: 150,
        category: "herbs",
        unit: "per 250g",
        image: "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?auto=format&fit=crop&w=400",
        description: "Hot Ethiopian chili powder"
    },
    {
        id: 11,
        name: "Oranges",
        price: 45,
        category: "fruits",
        unit: "per kg",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=400",
        description: "Juicy Ethiopian oranges"
    },
    {
        id: 12,
        name: "Fresh Lettuce",
        price: 25,
        category: "vegetables",
        unit: "per piece",
        image: "https://images.unsplash.com/photo-1567306301408-9b74779a11af?auto=format&fit=crop&w=400",
        description: "Crisp green lettuce"
    }
];

let cart = [];
const DOM = {
    cartCount: null,
    cartItems: null,
    subtotal: null,
    totalAmount: null,
    productsGrid: null,
    loginForm: null,
    registerForm: null,
    checkoutBtn: null,
    toast: null
};

function getDOM() {
    DOM.cartCount = document.getElementById('cartCount');
    DOM.toast = document.getElementById('toast');
    
    const currentPage = getCurrentPage();
    
    if (currentPage === 'cart') {
        DOM.cartItems = document.getElementById('cartItems');
        DOM.subtotal = document.getElementById('subtotal');
        DOM.totalAmount = document.getElementById('totalAmount');
        DOM.checkoutBtn = document.getElementById('checkoutBtn');
    }
    if (currentPage === 'products') {
        DOM.productsGrid = document.getElementById('productsGrid');
    }
    if (currentPage === 'home') {
        DOM.loginForm = document.getElementById('loginForm');
        DOM.registerForm = document.getElementById('registerForm');
    }
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop();
    
    if (page === '' || page === 'index.html' || page === 'index') return 'home';
    if (page === 'about.html' || page === 'about') return 'about';
    if (page === 'products.html' || page === 'products') return 'products';
    if (page === 'cart.html' || page === 'cart') return 'cart';
    
    return 'home';
}

function loadCart() {
    const savedCart = localStorage.getItem('mirtGebeyaCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            cart = [];
            localStorage.removeItem('mirtGebeyaCart');
        }
    } else {
        cart = [];
    }
}

function saveCart() {
    try {
        localStorage.setItem('mirtGebeyaCart', JSON.stringify(cart));
    } catch (error) {
        showToast('Error saving cart. Please try again.', 'error');
    }
}

function showToast(message, type = 'info', duration = 3000) {
    if (!DOM.toast) {
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        document.body.appendChild(toast);
        DOM.toast = toast;
    }
    
    DOM.toast.textContent = message;
    DOM.toast.className = 'toast show';
    
    if (type === 'success') {
        DOM.toast.style.backgroundColor = '#2e7d32';
    } else if (type === 'error') {
        DOM.toast.style.backgroundColor = '#d32f2f';
    } else {
        DOM.toast.style.backgroundColor = '#333';
    }
    
    setTimeout(() => {
        if (DOM.toast) {
            DOM.toast.classList.remove('show');
        }
    }, duration);
}

document.addEventListener('DOMContentLoaded', function() {
    getDOM();
    loadCart();
    updateCartCount();
    initPage();
    
    if (getCurrentPage() === 'home') {
        initAuthForms();
    }
    
    window.addEventListener('beforeunload', function() {
        saveCart();
    });
});

function initPage() {
    const page = getCurrentPage();
    
    switch(page) {
        case 'products':
            initProductsPage();
            break;
        case 'cart':
            initCartPage();
            break;
        case 'home':
            break;
        case 'about':
            break;
    }
}

function initAuthForms() {
    const authTabs = document.querySelectorAll('.auth-tab');
    
    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function(e) {
                e.preventDefault();
                const tabName = this.getAttribute('data-tab');
                switchAuthTab(tabName);
            });
        });
    }
    
    if (DOM.loginForm) {
        DOM.loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
        
        const loginPhone = document.getElementById('loginPhone');
        const loginPassword = document.getElementById('loginPassword');
        
        if (loginPhone) {
            loginPhone.addEventListener('input', function(e) {
                validatePhoneField(e.target);
            });
        }
        if (loginPassword) {
            loginPassword.addEventListener('input', function(e) {
                validatePasswordField(e.target);
            });
        }
    }
    
    if (DOM.registerForm) {
        DOM.registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegister();
        });
        
        const registerPhone = document.getElementById('registerPhone');
        const registerPassword = document.getElementById('registerPassword');
        
        if (registerPhone) {
            registerPhone.addEventListener('input', function(e) {
                validatePhoneField(e.target);
            });
        }
        if (registerPassword) {
            registerPassword.addEventListener('input', function(e) {
                validatePasswordField(e.target);
            });
        }
    }
}

function validatePhoneField(input) {
    const phoneRegex = /^09\d{8}$/;
    
    if (input.value.trim() === '') {
        input.setCustomValidity('');
        input.classList.remove('valid', 'invalid');
    } else if (!phoneRegex.test(input.value.trim())) {
        input.setCustomValidity('Please enter a valid Ethiopian phone number (09XXXXXXXX)');
        input.classList.remove('valid');
        input.classList.add('invalid');
    } else {
        input.setCustomValidity('');
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

function validatePasswordField(input) {
    if (input.value.trim() === '') {
        input.setCustomValidity('');
        input.classList.remove('valid', 'invalid');
    } else if (input.value.length < 6) {
        input.setCustomValidity('Password must be at least 6 characters');
        input.classList.remove('valid');
        input.classList.add('invalid');
    } else {
        input.setCustomValidity('');
        input.classList.remove('invalid');
        input.classList.add('valid');
    }
}

function switchAuthTab(tabName) {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    authTabs.forEach(tab => {
        const isActive = tab.getAttribute('data-tab') === tabName;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });
    
    authForms.forEach(form => {
        const isActive = form.id === tabName + 'Form';
        
        if (isActive) {
            form.classList.add('active');
            form.hidden = false;
            form.setAttribute('aria-hidden', 'false');
        } else {
            form.classList.remove('active');
            form.hidden = true;
            form.setAttribute('aria-hidden', 'true');
        }
    });
}

function handleLogin() {
    const phoneInput = document.getElementById('loginPhone');
    const passwordInput = document.getElementById('loginPassword');
    
    if (!phoneInput || !passwordInput) {
        showToast('Login form not found', 'error');
        return;
    }
    
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    
    if (!phone || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid Ethiopian phone number (09XXXXXXXX)', 'error');
        phoneInput.focus();
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        passwordInput.focus();
        return;
    }
    
    showToast('Login successful! Welcome to Mirt Gebeya!', 'success');
    
    phoneInput.value = '';
    passwordInput.value = '';
    
    localStorage.setItem('currentUser', JSON.stringify({
        phone: phone,
        loggedIn: true,
        loginTime: new Date().toISOString()
    }));
}

function handleRegister() {
    const nameInput = document.getElementById('registerName');
    const phoneInput = document.getElementById('registerPhone');
    const passwordInput = document.getElementById('registerPassword');
    const roleSelect = document.getElementById('registerRole');
    
    if (!nameInput || !phoneInput || !passwordInput || !roleSelect) {
        showToast('Registration form not found', 'error');
        return;
    }
    
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    const role = roleSelect.value;
    
    if (!name || !phone || !password) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    if (name.length < 2) {
        showToast('Please enter your full name', 'error');
        nameInput.focus();
        return;
    }
    
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
        showToast('Please enter a valid Ethiopian phone number (09XXXXXXXX)', 'error');
        phoneInput.focus();
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        passwordInput.focus();
        return;
    }
    
    const roleText = role === 'seller' ? 'Seller' : 'Buyer';
    showToast(`Welcome ${name}! ${roleText} account created successfully.`, 'success');
    
    const users = JSON.parse(localStorage.getItem('mirtGebeyaUsers') || '[]');
    users.push({
        name: name,
        phone: phone,
        role: role,
        registeredAt: new Date().toISOString()
    });
    localStorage.setItem('mirtGebeyaUsers', JSON.stringify(users));
    
    nameInput.value = '';
    phoneInput.value = '';
    passwordInput.value = '';
    roleSelect.selectedIndex = 0;
    
    switchAuthTab('login');
}

function initProductsPage() {
    if (DOM.productsGrid) {
        DOM.productsGrid.innerHTML = `
            <div class="loading-spinner" id="loadingSpinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading fresh products...</p>
            </div>
        `;
        
        setTimeout(() => {
            loadProducts();
            setupCategoryFilters();
            setupSearchFunctionality();
            setupSortFunctionality();
        }, 500);
    }
}

function loadProducts() {
    if (!DOM.productsGrid) {
        return;
    }
    
    if (products.length === 0) {
        DOM.productsGrid.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-seedling"></i>
                <h3>No products available</h3>
                <p>Check back soon for fresh products!</p>
            </div>
        `;
        return;
    }
    
    const productsHTML = products.map(product => {
        return `
        <div class="product-card" data-category="${product.category}" data-name="${product.name.toLowerCase()}">
            <div class="product-image-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-image"
                     loading="lazy">
                <div class="product-category">${product.category}</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price-section">
                    <span class="product-price">${product.price} Birr</span>
                    <span class="product-unit">${product.unit}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})" aria-label="Add ${product.name} to cart">
                    <i class="fas fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
        `;
    }).join('');
    
    DOM.productsGrid.innerHTML = productsHTML;
}

function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    if (categoryBtns.length === 0) {
        return;
    }
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    const productCards = document.querySelectorAll('.product-card');
    let visibleCount = 0;
    
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
}

function setupSearchFunctionality() {
    const searchInput = document.getElementById('productSearch');
    if (!searchInput) {
        return;
    }
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const productName = card.dataset.name;
            const shouldShow = searchTerm === '' || productName.includes(searchTerm);
            
            card.style.display = shouldShow ? 'block' : 'none';
        });
    });
}

function setupSortFunctionality() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) {
        return;
    }
    
    sortSelect.addEventListener('change', function() {
        const sortBy = this.value;
        
        loadProducts();
        
        const activeBtn = document.querySelector('.category-btn.active');
        if (activeBtn) {
            filterProducts(activeBtn.dataset.category);
        }
    });
}

function initCartPage() {
    if (DOM.cartItems) {
        DOM.cartItems.innerHTML = `
            <div class="loading-spinner">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Loading your cart...</p>
            </div>
        `;
        
        setTimeout(() => {
            loadCartItems();
        }, 300);
    }
    
    if (DOM.checkoutBtn) {
        DOM.checkoutBtn.addEventListener('click', processCheckout);
    }
    
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
        });
    });
}

function updateCartCount() {
    if (DOM.cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        DOM.cartCount.textContent = totalItems;
        DOM.cartCount.style.display = totalItems > 0 ? 'inline-block' : 'none';
        
        DOM.cartCount.setAttribute('aria-label', `${totalItems} items in cart`);
    }
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found!', 'error');
        return;
    }
    
    const existingItemIndex = cart.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showToast(`✓ ${product.name} added to cart!`, 'success');
    
    if (getCurrentPage() === 'cart') {
        loadCartItems();
    }
}

function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    const initialLength = cart.length;
    
    cart = cart.filter(item => item.id !== productId);
    
    if (cart.length < initialLength) {
        saveCart();
        updateCartCount();
        loadCartItems();
        if (product) {
            showToast(`${product.name} removed from cart`, 'success');
        }
    } else {
        showToast('Item not found in cart', 'error');
    }
}

function updateQuantity(productId, change) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex === -1) {
        showToast('Item not found in cart', 'error');
        return;
    }
    
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartCount();
        loadCartItems();
    }
}

function loadCartItems() {
    if (!DOM.cartItems || !DOM.subtotal || !DOM.totalAmount) return;
    
    if (cart.length === 0) {
        DOM.cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some fresh products to get started!</p>
                <a href="products.html" class="btn-primary">Browse Products</a>
            </div>
        `;
        DOM.subtotal.textContent = '0 Birr';
        DOM.totalAmount.textContent = '50 Birr';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-name">${item.name}</h4>
                <p class="cart-item-description">${item.description}</p>
                <div class="cart-item-price">${item.price} Birr / ${item.unit}</div>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity" aria-label="Current quantity: ${item.quantity}">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)" aria-label="Increase quantity">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="item-total" aria-label="Total for this item: ${item.price * item.quantity} Birr">
                    ${item.price * item.quantity} Birr
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name} from cart">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    DOM.cartItems.innerHTML = cartHTML;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;
    
    DOM.subtotal.textContent = `${subtotal} Birr`;
    DOM.totalAmount.textContent = `${total} Birr`;
}

function processCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'error');
        return;
    }
    
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cash';
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 50;
    
    const orderNumber = Math.floor(100000 + Math.random() * 900000);
    const paymentText = paymentMethod === 'telebirr' ? 'Telebirr' :
                      paymentMethod === 'cbe' ? 'CBE Birr' : 'Cash on Delivery';
    
    showToast(`✅ Order #${orderNumber} confirmed! Total: ${total} Birr (${paymentText})`, 'success');
    
    const orders = JSON.parse(localStorage.getItem('mirtGebeyaOrders') || '[]');
    orders.push({
        orderNumber: orderNumber,
        items: [...cart],
        total: total,
        paymentMethod: paymentMethod,
        date: new Date().toISOString()
    });
    localStorage.setItem('mirtGebeyaOrders', JSON.stringify(orders));
    
    cart = [];
    saveCart();
    updateCartCount();
    
    loadCartItems();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

window.addToCart = addToCart;
window.updateQuantity = updateQuantity;
window.removeFromCart = removeFromCart;

window.addEventListener('beforeunload', function() {
    saveCart();
});