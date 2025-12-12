// Products page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const productsContainer = document.getElementById('products-container');
    const newProductsContainer = document.getElementById('new-products');
    const loadMoreBtn = document.getElementById('loadMore');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    // Sample products data
    const products = [
        {
            id: 1,
            name: "Summer Elegance Dress",
            price: 8000,
            category: "women",
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTkXoUGxJ8eVZV4quGYXoYPJApwDjg0APaGETN0FbdUUqquF3sI0n1PM1hp9jY6UxnJmxlpr9zydGagxTVuKi9aw9U154O5Jn-h8DYoJy5zoMqOOZ2te0Iy",
            isNew: true
        },
        {
            id: 2,
            name: "Designer Leather Jacket",
            price: 14999,
            category: "men",
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTNb3wkFsgY0wyKFwNLdQ1Km6xAFVkhNAwBIrxaFqLUDXruw7S0vXiczt21sqrKVLdXhzW2KxxmNkLGDld4wK7uIwdonf7NJGZNgx5a-uG7BS0wp0allXra2A",
            isNew: true
        },
        {
            id: 3,
            name: "Casual Weekend Set",
            price: 6499,
            category: "women",
            image: "https://i.pinimg.com/1200x/8f/09/c8/8f09c8d9a2390c15cc7b096520a0c2d8.jpg",
            isNew: false
        },
        {
            id: 4,
            name: "Evening Silk Gown",
            price: 19999,
            category: "women",
            image: "https://i.pinimg.com/736x/0c/cb/18/0ccb184446a80eefcbcd216e20c195f3.jpg",
            isNew: false
        },
        {
            id: 5,
            name: "Classic Denim Jeans",
            price: 5999,
            category: "men",
            image: "https://i.pinimg.com/736x/85/c0/28/85c028f0e6c4b2793900b0a40ef06dc8.jpg",
            isNew: true
        },
        {
            id: 6,
            name: "Winter Wool Coat",
            price: 17999,
            category: "women",
            image: "https://i.pinimg.com/736x/5f/e4/bc/5fe4bcb195b6bc7e7b8e02a5cb1bf75f.jpg",
            isNew: false
        },
        {
            id: 7,
            name: "Sports Activewear",
            price: 4499,
            category: "accessories",
            image: "https://i.pinimg.com/736x/70/47/50/704750188220fd2e7e7b03f9f30495f6.jpg",
            isNew: true
        },
        {
            id: 8,
            name: "Formal Suit",
            price: 29999,
            category: "men",
            image: "https://i.pinimg.com/736x/1c/a6/d2/1ca6d25ddbe7a7040983f61af2d6c80b.jpg",
            isNew: false
        },
        {
            id: 9,
            name: "Designer Handbag",
            price: 12999,
            category: "accessories",
            image: "https://i.pinimg.com/736x/60/20/68/602068c076c9138ba97f02c3cc2f4367.jpg",
            isNew: true
        },
        {
            id: 10,
            name: "Running Shoes",
            price: 8999,
            category: "shoes",
            image: "https://i.pinimg.com/736x/73/dc/cc/73dccc6322d16ead620fb3a5511582c9.jpg",
            isNew: false
        },
        {
            id: 11,
            name: "Evening Clutch",
            price: 4999,
            category: "accessories",
            image: "https://i.pinimg.com/1200x/3e/d4/39/3ed43978e43ff68a770194f294c65449.jpg",
            isNew: true
        },
        {
            id: 12,
            name: "Casual Sneakers",
            price: 6999,
            category: "shoes",
            image: "https://i.pinimg.com/1200x/b3/da/01/b3da01b0f03385ff8fd431abe0561b46.jpg",
            isNew: false
        }
    ];
    
    let visibleProducts = 8;
    let filteredProducts = [...products];
    
    // Display initial products
    displayProducts();
    displayNewProducts();
    
    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleProducts += 4;
            displayProducts();
            
            if (visibleProducts >= filteredProducts.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
    
    // Filter functionality
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    function displayProducts() {
        if (!productsContainer) return;
        
        const productsToShow = filteredProducts.slice(0, visibleProducts);
        productsContainer.innerHTML = '';
        
        if (productsToShow.length === 0) {
            productsContainer.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try adjusting your filters</p>
                </div>
            `;
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }
        
        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card anim';
            productCard.innerHTML = `
                ${product.isNew ? '<span class="new-badge">New</span>' : ''}
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <p class="category">${getCategoryName(product.category)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            productsContainer.appendChild(productCard);
        });
        
        // Re-attach event listeners to new buttons
        productsContainer.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                addToCart(productId, product.name, `₹${product.price}`);
                showNotification(`${product.name} added to cart!`);
            });
        });
        
        // Update load more button visibility
        if (loadMoreBtn) {
            loadMoreBtn.style.display = visibleProducts >= filteredProducts.length ? 'none' : 'block';
        }
        
        // Add animation observer
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('anim-visible');
                }
            });
        }, { threshold: 0.1 });
        
        productsContainer.querySelectorAll('.anim').forEach(el => {
            observer.observe(el);
        });
    }
    
    function displayNewProducts() {
        if (!newProductsContainer) return;
        
        const newProducts = products.filter(product => product.isNew).slice(0, 4);
        
        newProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card anim';
            productCard.innerHTML = `
                <span class="new-badge">New</span>
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">₹${product.price.toFixed(2)}</p>
                <p class="category">${getCategoryName(product.category)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            `;
            newProductsContainer.appendChild(productCard);
        });
        
        // Attach event listeners
        newProductsContainer.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const product = products.find(p => p.id == productId);
                addToCart(productId, product.name, `₹${product.price}`);
                showNotification(`${product.name} added to cart!`);
            });
        });
    }
    
    function filterProducts() {
        const categoryValue = categoryFilter ? categoryFilter.value : 'all';
        const sortValue = sortFilter ? sortFilter.value : 'featured';
        
        filteredProducts = [...products];
        
        // Filter by category
        if (categoryValue !== 'all') {
            filteredProducts = filteredProducts.filter(product => 
                product.category === categoryValue
            );
        }
        
        // Sort products
        switch(sortValue) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProducts.sort((a, b) => {
                    if (a.isNew && !b.isNew) return -1;
                    if (!a.isNew && b.isNew) return 1;
                    return 0;
                });
                break;
            default: // featured
                filteredProducts.sort((a, b) => a.id - b.id);
        }
        
        visibleProducts = 8;
        displayProducts();
    }
    
    function getCategoryName(category) {
        const categories = {
            'women': "Women's Wear",
            'men': "Men's Wear",
            'accessories': "Accessories",
            'shoes': "Shoes"
        };
        return categories[category] || category;
    }
    
    // Add styles for new badge
    const style = document.createElement('style');
    style.textContent = `
        .new-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: #ff4757;
            color: white;
            padding: 5px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 1;
        }
        
        .product-card {
            position: relative;
        }
        
        .no-products {
            text-align: center;
            padding: 60px 20px;
            grid-column: 1 / -1;
        }
        
        .no-products i {
            font-size: 4rem;
            color: #e0e0e0;
            margin-bottom: 20px;
        }
        
        .no-products h3 {
            color: #333;
            margin-bottom: 10px;
        }
        
        .no-products p {
            color: #666;
        }
    `;
    document.head.appendChild(style);
});