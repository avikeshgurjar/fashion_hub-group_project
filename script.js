// Main JavaScript file for Fashion Hub

// Global cart functions
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: parseFloat(price.replace('₹', '').replace('$', '')),
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    document.querySelectorAll('.cart-count').forEach(element => {
        element.textContent = totalItems;
    });
}

function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <p>${message}</p>
        <button class="close-notification">&times;</button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', function() {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    updateCartCount();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navButtons = document.querySelector('.nav-buttons');
    const navList = document.querySelector('nav ul');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const isNavButtonsVisible = navButtons.style.display === 'flex';
            const isNavListVisible = navList.style.display === 'flex';
            
            if (window.innerWidth <= 992) {
                navButtons.style.display = isNavButtonsVisible ? 'none' : 'flex';
                navList.style.display = isNavListVisible ? 'none' : 'flex';
                
                // Add/remove show class for CSS transitions
                if (!isNavButtonsVisible) {
                    navButtons.classList.add('show');
                    navList.classList.add('show');
                } else {
                    navButtons.classList.remove('show');
                    navList.classList.remove('show');
                }
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992) {
            if (!event.target.closest('nav') && !event.target.closest('.mobile-menu-btn')) {
                if (navButtons) navButtons.style.display = 'none';
                if (navList) navList.style.display = 'none';
                if (navButtons) navButtons.classList.remove('show');
                if (navList) navList.classList.remove('show');
            }
        }
    });
    
    // Add to cart functionality for static buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            const productName = this.parentElement.querySelector('h3').textContent;
            const productPrice = this.parentElement.querySelector('.price').textContent;
            
            addToCart(productId, productName, productPrice);
            showNotification(`${productName} added to cart!`);
        });
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (validateEmail(email)) {
                showNotification('Thank you for subscribing to our newsletter!');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Add notification styles if not already present
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #4CAF50;
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-width: 300px;
                max-width: 400px;
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            }
            
            .notification.show {
                transform: translateX(0);
            }
            
            .notification.error {
                background: #ff4757;
            }
            
            .close-notification {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                margin-left: 10px;
                line-height: 1;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add scroll animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('anim-visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.anim').forEach(el => {
        observer.observe(el);
    });
    
    // Check login status and update UI
    updateLoginStatus();
});

function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userName = localStorage.getItem('userName');
    
    const loginBtn = document.querySelector('a[href="login-page.html"]');
    const signupBtn = document.querySelector('a[href="signup-page.html"]');
    const profileBtn = document.querySelector('a[href="dashboard.html"]');
    
    if (isLoggedIn === 'true' && userName) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (profileBtn) profileBtn.textContent = `Hi, ${userName}`;
    }
}