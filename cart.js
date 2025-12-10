// Cart page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalItems = document.getElementById('cart-total-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const taxElement = document.getElementById('tax');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Display cart items
    displayCartItems();
    
    // Checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Your cart is empty!', 'error');
                return;
            }
            
            const total = calculateTotal();
            if (confirm(`Proceed to checkout? Total: ₹${total.toFixed(2)}`)) {
                // Create order
                const order = {
                    id: Date.now().toString(),
                    date: new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    items: cart.map(item => `${item.name} × ${item.quantity}`),
                    total: `₹${total.toFixed(2)}`,
                    status: 'processing'
                };
                
                // Save order to localStorage
                const orders = JSON.parse(localStorage.getItem('orders')) || [];
                orders.unshift(order);
                localStorage.setItem('orders', JSON.stringify(orders));
                
                // Clear cart
                localStorage.removeItem('cart');
                cart = [];
                
                showNotification('Checkout successful! Your order has been placed.');
                
                setTimeout(() => {
                    displayCartItems();
                    updateCartCount();
                }, 500);
            }
        });
    }
    
    function displayCartItems() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some fashion items to get started!</p>
                    <a href="products.html" class="btn">Shop Now</a>
                </div>
            `;
            updateSummary();
            if (cartTotalItems) cartTotalItems.textContent = '0';
            return;
        }
        
        cartItemsContainer.innerHTML = '';
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="index-images/fashion${(item.id % 4) + 1}.jpg" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>Size: M | Color: Black</p>
                    <p class="price">₹${item.price.toFixed(2)} each</p>
                </div>
                <div class="quantity-control">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <div class="item-price">₹${(item.price * item.quantity).toFixed(2)}</div>
                <button class="remove-item" data-index="${index}"><i class="fas fa-trash"></i></button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners
        cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
        
        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', handleQuantityInput);
        });
        
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', removeItem);
        });
        
        updateSummary();
        if (cartTotalItems) {
            cartTotalItems.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        }
    }
    
    function handleQuantityChange(e) {
        const index = e.target.getAttribute('data-index');
        const input = document.querySelector(`.quantity-input[data-index="${index}"]`);
        let value = parseInt(input.value);
        
        if (e.target.classList.contains('plus')) {
            value++;
        } else if (e.target.classList.contains('minus') && value > 1) {
            value--;
        }
        
        input.value = value;
        updateCartItem(index, value);
    }
    
    function handleQuantityInput(e) {
        const index = e.target.getAttribute('data-index');
        let value = parseInt(e.target.value);
        
        if (isNaN(value) || value < 1) value = 1;
        if (value > 99) value = 99;
        
        e.target.value = value;
        updateCartItem(index, value);
    }
    
    function updateCartItem(index, quantity) {
        cart[index].quantity = quantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateSummary();
        updateCartCount();
        
        // Update price display
        const priceElement = document.querySelector(`.cart-item:nth-child(${parseInt(index) + 1}) .item-price`);
        if (priceElement) {
            priceElement.textContent = `₹${(cart[index].price * quantity).toFixed(2)}`;
        }
    }
    
    function removeItem(e) {
        const index = e.target.closest('.remove-item').getAttribute('data-index');
        const itemName = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
        showNotification(`${itemName} removed from cart`);
    }
    
    function updateSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 500;
        const tax = subtotal * 0.18; // 18% tax
        const total = subtotal + shipping + tax;
        
        if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
        if (shippingElement) shippingElement.textContent = subtotal > 5000 ? 'FREE' : `₹${shipping.toFixed(2)}`;
        if (taxElement) taxElement.textContent = `₹${tax.toFixed(2)}`;
        if (totalElement) totalElement.textContent = `₹${total.toFixed(2)}`;
    }
    
    function calculateTotal() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 5000 ? 0 : 500;
        const tax = subtotal * 0.18;
        return subtotal + shipping + tax;
    }
    
    // Add styles for cart
    const style = document.createElement('style');
    style.textContent = `
        .cart-item-info .price {
            color: #df4881;
            font-weight: 600;
            margin-top: 5px;
        }
    `;
    document.head.appendChild(style);
});